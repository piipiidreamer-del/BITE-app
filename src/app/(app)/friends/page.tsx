import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FriendsClient from '@/components/profile/FriendsClient'

export default async function FriendsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: friendships } = await supabase
    .from('friendships')
    .select('*, requester:requester_id(id,nickname,user_handle,icon_char,icon_bg_color,icon_text_color,streak), addressee:addressee_id(id,nickname,user_handle,icon_char,icon_bg_color,icon_text_color,streak)')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

  const { data: pending } = await supabase
    .from('friendships')
    .select('*, requester:requester_id(id,nickname,user_handle,icon_char,icon_bg_color,icon_text_color,streak)')
    .eq('addressee_id', user.id).eq('status', 'pending')

  const friends = (friendships ?? []).map(f => {
    const isRequester = (f.requester as any)?.id === user.id
    return isRequester ? f.addressee : f.requester
  }).filter(Boolean)

  return (
    <div className="min-h-dvh bg-bite-bg pb-24">
      <div className="bg-gradient-to-br from-bite-teal to-bite-purple px-5 pt-12 pb-10 relative overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 430 24" preserveAspectRatio="none">
          <path d="M0,12 C72,24 144,0 215,12 C286,24 358,0 430,12 L430,24 L0,24 Z" fill="#F0FFFE"/>
        </svg>
        <h1 className="font-display text-4xl text-white relative">友達 👥</h1>
        <p className="text-white/70 font-body text-sm mt-1 relative">{friends.length}人の友達</p>
      </div>
      <div className="px-4 -mt-2 pb-4">
        <FriendsClient myUserId={user.id} friends={friends as any} pendingRequests={pending as any ?? []} friendships={friendships as any ?? []} />
      </div>
    </div>
  )
}
