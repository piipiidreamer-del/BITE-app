import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import RankDisplay from '@/components/profile/RankDisplay'
import PostGrid from '@/components/profile/PostGrid'
import FriendActionButton from '@/components/profile/FriendActionButton'

export default async function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (userId === user.id) redirect('/profile')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (!profile) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const { data: friendship } = await supabase
    .from('friendships')
    .select('*')
    .or(`and(requester_id.eq.${user.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${user.id})`)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-bite-bg pb-6">
      <div className="bg-white rounded-b-4xl shadow-bubbly px-4 pt-8 pb-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/friends" className="text-bite-purple font-bold font-body text-sm">← Back</Link>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar char={profile.icon_char} bgColor={profile.icon_bg_color} textColor={profile.icon_text_color} size="xl" />
          <div className="text-center">
            <h1 className="font-display text-2xl text-gray-800">{profile.nickname}</h1>
            <p className="text-sm text-gray-400 font-body">@{profile.user_handle}</p>
          </div>
          <RankDisplay streak={profile.streak} />
          <div className="flex gap-6 mt-1">
            <div className="text-center">
              <p className="font-display text-xl text-bite-purple">{posts?.length ?? 0}</p>
              <p className="text-xs text-gray-400 font-body">Posts</p>
            </div>
          </div>
          <FriendActionButton myUserId={user.id} targetUserId={userId} friendship={friendship as any} />
        </div>
      </div>

      <div className="px-4">
        <h2 className="font-display text-xl text-bite-purple mb-3">Their Bites 📸</h2>
        <PostGrid posts={posts ?? []} />
      </div>
    </div>
  )
}
