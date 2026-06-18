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
    .from('posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

  const { count: friendCount } = await supabase
    .from('friendships').select('id', { count: 'exact', head: true }).eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

  async function logout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-dvh bg-bite-bg pb-24">
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-bite-purple via-bite-purple to-bite-purple-light pt-12 pb-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-6 right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 430 32" preserveAspectRatio="none">
          <path d="M0,16 C80,32 160,0 215,16 C270,32 350,0 430,16 L430,32 L0,32 Z" fill="#F0FFFE"/>
        </svg>
        <div className="relative flex flex-col items-center gap-4 px-5">
          <Avatar
            char={profile.icon_char}
            bgColor={profile.icon_bg_color}
            textColor={profile.icon_text_color}
            size="xl"
            name={profile.nickname}
            ring
          />
          <div className="text-center">
            <h1 className="font-display text-2xl text-white">{profile.nickname}</h1>
            <p className="text-white/60 font-body text-sm">@{profile.user_handle}</p>
          </div>
        </div>
      </div>

      {/* Rank card — floated over the wave */}
      <div className="px-5 -mt-10 relative z-10">
        <div className="bg-white rounded-[2rem] p-5 shadow-bubbly-lg">
          <RankDisplay streak={profile.streak} showProgress />

          {/* Stats row */}
          <div className="flex items-center justify-around mt-5 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="font-display text-2xl text-bite-purple">{posts?.length ?? 0}</p>
              <p className="text-xs text-gray-400 font-body">投稿</p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="text-center">
              <p className="font-display text-2xl text-bite-purple">{friendCount ?? 0}</p>
              <p className="text-xs text-gray-400 font-body">友達</p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="text-center">
              <p className="font-display text-2xl text-bite-purple">{profile.streak}</p>
              <p className="text-xs text-gray-400 font-body">連続日数</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Link href="/friends" className="flex-1 bg-bite-purple/10 text-bite-purple font-bold font-body text-sm py-3 rounded-2xl text-center">
              友達 👥
            </Link>
            <form action={logout} className="flex-1">
              <button type="submit" className="w-full bg-gray-100 text-gray-500 font-bold font-body text-sm py-3 rounded-2xl">
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Post history */}
      <div className="px-5 mt-5">
        <h2 className="font-display text-xl text-bite-purple mb-3">Bite履歴 📸</h2>
        <PostGrid posts={posts ?? []} />
      </div>
    </div>
  )
}
