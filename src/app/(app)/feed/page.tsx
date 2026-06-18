import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { hasPostedToday } from '@/lib/utils/postLock'
import PostLockScreen from '@/components/feed/PostLockScreen'
import FeedStack from '@/components/feed/FeedStack'
import type { Post, ReactionEmoji } from '@/lib/types/database'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!hasPostedToday(profile?.last_post_date ?? null)) {
    return (
      <div className="min-h-screen">
        <div className="px-4 pt-6 pb-2">
          <h1 className="font-display text-3xl text-bite-purple">Feed 🍽️</h1>
        </div>
        <PostLockScreen />
      </div>
    )
  }

  // Get friend IDs
  const { data: friendships } = await supabase
    .from('friendships')
    .select('requester_id, addressee_id')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  )

  if (friendIds.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="px-4 pt-6 pb-2">
          <h1 className="font-display text-3xl text-bite-purple">Feed 🍽️</h1>
        </div>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6">
          <div className="text-6xl">👥</div>
          <h3 className="font-display text-2xl text-bite-purple">No friends yet!</h3>
          <p className="font-body text-gray-500 text-sm">Add friends to see their bites here.</p>
        </div>
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

  // Get my reactions on these posts
  const postIds = (posts ?? []).map(p => p.id)
  const { data: myReactions } = await supabase
    .from('reactions')
    .select('*')
    .eq('user_id', user.id)
    .in('post_id', postIds)

  const { data: allReactions } = await supabase
    .from('reactions')
    .select('*')
    .in('post_id', postIds)

  const emojis: ReactionEmoji[] = ['drool', 'plead', 'neutral']

  const postsWithMeta = (posts ?? []).map(post => {
    const myReaction = myReactions?.find(r => r.post_id === post.id)?.emoji as ReactionEmoji | null ?? null
    const counts = Object.fromEntries(
      emojis.map(e => [e, (allReactions ?? []).filter(r => r.post_id === post.id && r.emoji === e).length])
    ) as Record<ReactionEmoji, number>
    return { ...post, myReaction, reactionCounts: counts }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-4 pt-6 pb-2 flex items-center justify-between">
        <h1 className="font-display text-3xl text-bite-purple">Feed 🍽️</h1>
        <span className="text-xs font-body text-gray-400">{postsWithMeta.length} bites today</span>
      </div>

      <div className="flex-1 relative mx-4 mb-4" style={{ minHeight: '520px' }}>
        <FeedStack posts={postsWithMeta as any} myUserId={user.id} />
      </div>
    </div>
  )
}
