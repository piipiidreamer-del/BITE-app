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
    .eq('addressee_id', user.id)
    .eq('status', 'pending')

  const friends = (friendships ?? []).map(f => {
    const isRequester = (f.requester as any)?.id === user.id
    return isRequester ? f.addressee : f.requester
  }).filter(Boolean)

  return (
    <div className="min-h-screen bg-bite-bg px-4 pt-6 pb-6">
      <h1 className="font-display text-3xl text-bite-purple mb-6">Friends 👥</h1>
      <FriendsClient
        myUserId={user.id}
        friends={friends as any}
        pendingRequests={pending as any ?? []}
        friendships={friendships as any ?? []}
      />
    </div>
  )
}
