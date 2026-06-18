import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasPostedToday } from '@/lib/utils/postLock'
import PostLockScreen from '@/components/feed/PostLockScreen'
import FeedStack from '@/components/feed/FeedStack'
import type { Post, ReactionEmoji } from '@/lib/types/database'
import Link from 'next/link'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const locked = !hasPostedToday(profile?.last_post_date ?? null)

  return (
    <div className="min-h-dvh bg-bite-bg pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="w-9 h-9 rounded-xl bg-bite-purple/10 flex items-center justify-center">
          <Link href="/friends"><span className="text-xl">👥</span></Link>
        </div>
        <span className="font-display text-2xl text-bite-purple">Bite</span>
        <div className="flex items-center gap-1.5 bg-bite-purple/10 px-3 py-1.5 rounded-full">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-bold text-bite-purple font-body">
            {profile?.streak ?? 0}日連続中！
          </span>
        </div>
      </div>

      {locked ? (
        <PostLockScreen />
      ) : (
        <FriendFeedSection userId={user.id} />
      )}
    </div>
  )
}

async function FriendFeedSection({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: friendships } = await supabase
    .from('friendships')
    .select('requester_id, addressee_id')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)

  const friendIds = (friendships ?? []).map(f =>
    f.requester_id === userId ? f.addressee_id : f.requester_id
  )

  if (friendIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-5 text-center px-6 py-12">
        <div className="text-7xl float">👥</div>
        <div>
          <h3 className="font-display text-2xl text-bite-purple mb-1">友達がいないよ！</h3>
          <p className="font-body text-gray-400 text-sm">友達を追加してフィードを楽しもう</p>
        </div>
        <Link href="/friends" className="bg-bite-gradient text-white font-bold font-body px-6 py-3 rounded-3xl text-sm shadow-teal">
          友達を探す 👥
        </Link>
      </div>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .in('user_id', friendIds)
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false })

  const postIds = (posts ?? []).map(p => p.id)
  const { data: myReactions } = await supabase.from('reactions').select('*').eq('user_id', userId).in('post_id', postIds)
  const { data: allReactions } = await supabase.from('reactions').select('*').in('post_id', postIds)

  const emojis: ReactionEmoji[] = ['drool', 'plead', 'neutral']
  const postsWithMeta = (posts ?? []).map(post => {
    const myReaction = (myReactions?.find(r => r.post_id === post.id)?.emoji as ReactionEmoji) ?? null
    const counts = Object.fromEntries(
      emojis.map(e => [e, (allReactions ?? []).filter(r => r.post_id === post.id && r.emoji === e).length])
    ) as Record<ReactionEmoji, number>
    return { ...post, myReaction, reactionCounts: counts }
  })

  return (
    <div className="flex-1 flex flex-col px-4 pt-4">
      {/* Today's bites count */}
      <div className="bg-bite-purple/8 rounded-2xl px-4 py-2.5 mb-3 flex items-center gap-2">
        <span className="text-sm">🍽️</span>
        <span className="text-sm font-bold font-body text-bite-purple">今日のBite：{postsWithMeta.length}件</span>
        <span className="ml-auto text-xs text-gray-400 font-body">はらって見よう！</span>
      </div>
      <FeedStack posts={postsWithMeta as any} myUserId={userId} />
    </div>
  )
}
