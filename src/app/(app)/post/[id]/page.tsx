import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import ReactionBar from '@/components/post/ReactionBar'
import CommentThread from '@/components/post/CommentThread'
import type { ReactionEmoji } from '@/lib/types/database'

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: post } = await supabase.from('posts').select('*, profiles(*)').eq('id', id).single()
  if (!post) notFound()

  const { data: myReactionRow } = await supabase.from('reactions').select('emoji').eq('post_id', id).eq('user_id', user.id).maybeSingle()
  const { data: allReactions } = await supabase.from('reactions').select('emoji').eq('post_id', id)
  const { data: comments } = await supabase.from('comments').select('*, profiles(*)').eq('post_id', id).order('created_at', { ascending: true })

  const emojis: ReactionEmoji[] = ['drool', 'plead', 'neutral']
  const counts = Object.fromEntries(emojis.map(e => [e, (allReactions ?? []).filter(r => r.emoji === e).length])) as Record<ReactionEmoji, number>

  await supabase.from('post_views').upsert({ post_id: id, viewer_id: user.id }, { onConflict: 'post_id,viewer_id' })

  const profile = post.profiles as any

  return (
    <div className="min-h-dvh bg-bite-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/feed" className="w-9 h-9 rounded-xl bg-bite-purple/10 flex items-center justify-center text-lg font-bold text-bite-purple">←</Link>
        <span className="font-display text-xl text-bite-purple flex-1">Bite</span>
        <span className="text-xs text-gray-400 font-body">
          {new Date(post.created_at).toLocaleDateString('ja', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Post card */}
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-bubbly">
          {/* User row */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <Avatar char={profile?.icon_char} bgColor={profile?.icon_bg_color} textColor={profile?.icon_text_color} size="sm" name={profile?.nickname} />
            <div>
              <p className="font-bold font-body text-gray-800">{profile?.nickname}</p>
              <p className="text-xs text-gray-400 font-body">@{profile?.user_handle}</p>
            </div>
          </div>

          {/* Images */}
          <div className="px-3 pb-3 flex flex-col gap-1">
            {[post.image_top, post.image_middle, post.image_bottom].map((src, i) => (
              <div key={i} className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: i === 0 ? '4/3' : '4/2' }}>
                <Image src={src} alt="" fill className="object-cover" sizes="430px" />
              </div>
            ))}
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="px-4 pb-4">
              <p className="font-body text-gray-700">{post.caption}</p>
            </div>
          )}
        </div>

        {/* Reactions */}
        <div className="bg-white rounded-[2rem] p-5 shadow-bubbly">
          <h3 className="font-display text-xl text-bite-purple mb-3">リアクション</h3>
          <ReactionBar postId={post.id} myReaction={(myReactionRow?.emoji as ReactionEmoji) ?? null} counts={counts} myUserId={user.id} />
        </div>

        {/* Comments */}
        <div className="bg-white rounded-[2rem] p-5 shadow-bubbly">
          <CommentThread postId={post.id} myUserId={user.id} initialComments={comments as any ?? []} />
        </div>
      </div>
    </div>
  )
}
