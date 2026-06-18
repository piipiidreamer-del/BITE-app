import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import RankDisplay from '@/components/profile/RankDisplay'
import PostGrid from '@/components/profile/PostGrid'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/onboarding')

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bite-bg pb-6">
      <div className="bg-white rounded-b-4xl shadow-bubbly px-4 pt-8 pb-6 mb-4">
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
        </div>

        <div className="flex gap-2 mt-4">
          <Link href="/friends" className="flex-1 text-center bg-bite-purple/10 text-bite-purple font-bold font-body py-2 rounded-2xl text-sm">
            Friends 👥
          </Link>
          <form action={logout} className="flex-1">
            <button type="submit" className="w-full text-center bg-gray-100 text-gray-600 font-bold font-body py-2 rounded-2xl text-sm">
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="px-4">
        <h2 className="font-display text-xl text-bite-purple mb-3">Your Bites 📸</h2>
        <PostGrid posts={posts ?? []} />
      </div>
    </div>
  )
}
