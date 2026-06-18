'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Friendship } from '@/lib/types/database'
import { cn } from '@/lib/utils/cn'

interface Props {
  myUserId: string
  targetUserId: string
  friendship: Friendship | null
}

export default function FriendActionButton({ myUserId, targetUserId, friendship: initial }: Props) {
  const [friendship, setFriendship] = useState(initial)
  const [loading, setLoading] = useState(false)

  async function sendRequest() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('friendships')
      .insert({ requester_id: myUserId, addressee_id: targetUserId, status: 'pending' })
      .select()
      .single()
    if (data) setFriendship(data as Friendship)
    setLoading(false)
  }

  async function acceptRequest() {
    if (!friendship) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendship.id)
      .select()
      .single()
    if (data) setFriendship(data as Friendship)
    setLoading(false)
  }

  async function removeFriend() {
    if (!friendship) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('friendships').delete().eq('id', friendship.id)
    setFriendship(null)
    setLoading(false)
  }

  if (!friendship) {
    return (
      <button onClick={sendRequest} disabled={loading} className="bg-bite-gradient text-white font-bold font-body px-6 py-2 rounded-3xl text-sm disabled:opacity-50">
        {loading ? '...' : 'Add Friend ➕'}
      </button>
    )
  }

  if (friendship.status === 'pending') {
    if (friendship.requester_id === myUserId) {
      return <span className="text-gray-400 font-body text-sm font-bold px-4 py-2 bg-gray-100 rounded-3xl">Requested ⏳</span>
    }
    return (
      <button onClick={acceptRequest} disabled={loading} className="bg-bite-teal text-white font-bold font-body px-6 py-2 rounded-3xl text-sm disabled:opacity-50">
        {loading ? '...' : 'Accept Request 🤝'}
      </button>
    )
  }

  return (
    <button onClick={removeFriend} disabled={loading} className="bg-gray-100 text-gray-600 font-bold font-body px-6 py-2 rounded-3xl text-sm disabled:opacity-50">
      {loading ? '...' : 'Friends ✓'}
    </button>
  )
}
