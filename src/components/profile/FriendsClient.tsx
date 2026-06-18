'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/ui/Avatar'
import type { Profile, Friendship } from '@/lib/types/database'
import { getRank } from '@/lib/utils/rank'

interface Props {
  myUserId: string
  friends: Profile[]
  pendingRequests: (Friendship & { requester: Profile })[]
  friendships: any[]
}

export default function FriendsClient({ myUserId, friends: initialFriends, pendingRequests: initialPending, friendships }: Props) {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState<Profile | null | 'not-found' | 'loading'>(null)
  const [friends, setFriends] = useState(initialFriends)
  const [pending, setPending] = useState(initialPending)
  const [sendLoading, setSendLoading] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    setSearchResult('loading')
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_handle', search.trim().replace('@', ''))
      .neq('id', myUserId)
      .maybeSingle()
    setSearchResult(data ?? 'not-found')
  }

  async function sendRequest(targetId: string) {
    setSendLoading(true)
    const supabase = createClient()
    await supabase.from('friendships').insert({ requester_id: myUserId, addressee_id: targetId, status: 'pending' })
    setSendLoading(false)
    setSearch('')
    setSearchResult(null)
  }

  async function acceptRequest(friendshipId: string, requester: Profile) {
    setAcceptLoading(friendshipId)
    const supabase = createClient()
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    setFriends(prev => [...prev, requester])
    setPending(prev => prev.filter(p => p.id !== friendshipId))
    setAcceptLoading(null)
  }

  const alreadyFriendIds = new Set(friends.map(f => f.id))
  const alreadyFriend = searchResult && searchResult !== 'loading' && searchResult !== 'not-found' && alreadyFriendIds.has(searchResult.id)

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="bg-white rounded-4xl p-4 shadow-bubbly">
        <h2 className="font-display text-xl text-bite-purple mb-3">Find friends 🔍</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="@handle"
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-bite-teal"
          />
          <button type="submit" className="bg-bite-gradient text-white font-bold font-body px-4 py-3 rounded-2xl text-sm">
            Search
          </button>
        </form>

        {searchResult === 'loading' && <p className="text-gray-400 text-sm font-body mt-3 text-center">Searching...</p>}
        {searchResult === 'not-found' && <p className="text-red-400 text-sm font-body mt-3 text-center">No user found 😢</p>}
        {searchResult && searchResult !== 'loading' && searchResult !== 'not-found' && (
          <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-2xl">
            <Avatar char={searchResult.icon_char} bgColor={searchResult.icon_bg_color} textColor={searchResult.icon_text_color} size="sm" />
            <div className="flex-1">
              <p className="font-bold text-sm font-body text-gray-800">{searchResult.nickname}</p>
              <p className="text-xs text-gray-400 font-body">@{searchResult.user_handle}</p>
            </div>
            {alreadyFriend ? (
              <span className="text-xs text-gray-400 font-body">Already friends</span>
            ) : (
              <button onClick={() => sendRequest(searchResult.id)} disabled={sendLoading} className="bg-bite-gradient text-white text-xs font-bold font-body px-3 py-2 rounded-xl disabled:opacity-50">
                {sendLoading ? '...' : 'Add ➕'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="bg-white rounded-4xl p-4 shadow-bubbly">
          <h2 className="font-display text-xl text-bite-purple mb-3">Requests ({pending.length})</h2>
          <div className="flex flex-col gap-2">
            {pending.map(req => (
              <div key={req.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-2xl">
                <Avatar char={(req.requester as any)?.icon_char} bgColor={(req.requester as any)?.icon_bg_color} textColor={(req.requester as any)?.icon_text_color} size="sm" />
                <div className="flex-1">
                  <p className="font-bold text-sm font-body text-gray-800">{(req.requester as any)?.nickname}</p>
                  <p className="text-xs text-gray-400 font-body">@{(req.requester as any)?.user_handle}</p>
                </div>
                <button
                  onClick={() => acceptRequest(req.id, req.requester as any)}
                  disabled={acceptLoading === req.id}
                  className="bg-bite-teal text-white text-xs font-bold font-body px-3 py-2 rounded-xl disabled:opacity-50"
                >
                  {acceptLoading === req.id ? '...' : 'Accept 🤝'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div className="bg-white rounded-4xl p-4 shadow-bubbly">
        <h2 className="font-display text-xl text-bite-purple mb-3">Your friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <p className="text-gray-400 text-sm font-body text-center py-4">No friends yet. Search above! 🍽️</p>
        ) : (
          <div className="flex flex-col gap-2">
            {friends.map(f => {
              const rank = getRank(f.streak)
              return (
                <Link key={f.id} href={`/profile/${f.id}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                  <Avatar char={f.icon_char} bgColor={f.icon_bg_color} textColor={f.icon_text_color} size="sm" />
                  <div className="flex-1">
                    <p className="font-bold text-sm font-body text-gray-800">{f.nickname}</p>
                    <p className="text-xs text-gray-400 font-body">@{f.user_handle}</p>
                  </div>
                  <span className="text-xs font-bold font-body" style={{ color: rank.color }}>{rank.emoji} {rank.name}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
