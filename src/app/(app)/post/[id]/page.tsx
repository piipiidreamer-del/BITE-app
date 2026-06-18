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

  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const { data: myReactionRow } = await supabase
    .from('reactions')
    .select('emoji')
    .eq('post_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: allReactions } = await supabase
    .from('reactions')
    .select('emoji')
    .eq('post_id', id)

  const emojis: ReactionEmoji[] = ['drool', 'plead', 'neutral']
  const counts = Object.fromEntries(
    emojis.map(e => [e, (allReactions ?? []).filter(r => r.emoji === e).length])
  ) as Record<ReactionEmoji, number>

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  // Log view
  await supabase.from('post_views').upsert({ post_id: id, viewer_id: user.id }, { onConflict: 'post_id,viewer_id' })

  const profile = post.profiles as any

  return (
    <div className="min-h-screen bg-bite-bg flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-6 pb-3">
        <Link href="/feed" className="text-bite-purple font-bold font-body">← Back</Link>
        <h1 className="font-display text-2xl text-bite-purple">Bite 🍔</h1>
      </div>

      <div className="px-4 pb-6 flex flex-col gap-4">
        <div className="bg-white rounded-4xl p-4 shadow-bubbly flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar char={profile?.icon_char} bgColor={profile?.icon_bg_color} textColor={profile?.icon_text_color} size="md" />
            <div>
              <p className="font-bold font-body text-gray-800">{profile?.nickname}</p>
              <p className="text-xs text-gray-400 font-body">@{profile?.user_handle} · {new Date(post.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          {[post.image_top, post.image_middle, post.image_bottom].map((src, i) => (
            <div key={i} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={src} alt="" fill className="object-cover" sizes="430px" />
            </div>
          ))}

          {post.caption && <p className="font-body text-gray-700">{post.caption}</p>}

          <ReactionBar
            postId={post.id}
            myReaction={(myReactionRow?.emoji as ReactionEmoji) ?? null}
            counts={counts}
            myUserId={user.id}
          />
        </div>

        <div className="bg-white rounded-4xl p-4 shadow-bubbly">
          <CommentThread postId={post.id} myUserId={user.id} initialComments={comments as any ?? []} />
        </div>
      </div>
    </div>
  )
}
