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

export default function FriendsClient({ myUserId, friends: initialFriends, pendingRequests: initialPending }: Props) {
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState<Profile | null | 'not-found' | 'loading'>(null)
  const [friends, setFriends] = useState(initialFriends)
  const [pending, setPending] = useState(initialPending)
  const [sendLoading, setSendLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [acceptLoading, setAcceptLoading] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    setSearchResult('loading')
    setRequestSent(false)
    const supabase = createClient()
    const { data } = await supabase.from('profiles').select('*').eq('user_handle', search.trim().replace('@', '')).neq('id', myUserId).maybeSingle()
    setSearchResult(data ?? 'not-found')
  }

  async function sendRequest(targetId: string) {
    setSendLoading(true)
    const supabase = createClient()
    await supabase.from('friendships').insert({ requester_id: myUserId, addressee_id: targetId, status: 'pending' })
    setSendLoading(false)
    setRequestSent(true)
  }

  async function acceptRequest(friendshipId: string, requester: Profile) {
    setAcceptLoading(friendshipId)
    const supabase = createClient()
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    setFriends(prev => [...prev, requester])
    setPending(prev => prev.filter(p => p.id !== friendshipId))
    setAcceptLoading(null)
  }

  const friendIds = new Set(friends.map(f => f.id))

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="bg-white rounded-[2rem] p-5 shadow-bubbly">
        <h2 className="font-display text-xl text-bite-purple mb-1">友達を探す 🔍</h2>
        <p className="text-xs text-gray-400 font-body mb-4">@ハンドルで検索できるよ</p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="@handle"
            className="flex-1 bg-gray-50 border-2 border-bite-purple/20 rounded-2xl px-4 py-3 text-sm font-body focus:outline-none focus:border-bite-purple"
          />
          <button type="submit" className="bg-bite-gradient text-white font-bold font-body px-5 py-3 rounded-2xl text-sm btn-press shadow-teal">
            検索
          </button>
        </form>

        {searchResult === 'loading' && <div className="text-center py-4 text-gray-400 text-sm font-body">検索中...</div>}
        {searchResult === 'not-found' && <div className="text-center py-4 text-red-400 text-sm font-body">見つかりませんでした 😢</div>}
        {searchResult && searchResult !== 'loading' && searchResult !== 'not-found' && (
          <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
            <Avatar char={searchResult.icon_char} bgColor={searchResult.icon_bg_color} textColor={searchResult.icon_text_color} size="sm" name={searchResult.nickname} />
            <div className="flex-1">
              <p className="font-bold text-sm font-body text-gray-800">{searchResult.nickname}</p>
              <p className="text-xs text-gray-400 font-body">@{searchResult.user_handle}</p>
            </div>
            {friendIds.has(searchResult.id) ? (
              <span className="text-xs text-gray-400 font-body bg-gray-200 px-3 py-1.5 rounded-full">友達 ✓</span>
            ) : requestSent ? (
              <span className="text-xs text-bite-teal font-bold font-body bg-bite-teal/10 px-3 py-1.5 rounded-full">リクエスト済み ⏳</span>
            ) : (
              <button onClick={() => sendRequest(searchResult.id)} disabled={sendLoading} className="bg-bite-gradient text-white text-xs font-bold font-body px-4 py-2 rounded-2xl btn-press shadow-teal disabled:opacity-50">
                {sendLoading ? '...' : '追加 ➕'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="bg-white rounded-[2rem] p-5 shadow-bubbly">
          <h2 className="font-display text-xl text-bite-purple mb-3">リクエスト ({pending.length}) 🤝</h2>
          <div className="flex flex-col gap-2">
            {pending.map(req => (
              <div key={req.id} className="flex items-center gap-3 bg-bite-purple/5 rounded-2xl p-3">
                <Avatar char={(req.requester as any)?.icon_char} bgColor={(req.requester as any)?.icon_bg_color} textColor={(req.requester as any)?.icon_text_color} size="sm" name={(req.requester as any)?.nickname} />
                <div className="flex-1">
                  <p className="font-bold text-sm font-body">{(req.requester as any)?.nickname}</p>
                  <p className="text-xs text-gray-400 font-body">@{(req.requester as any)?.user_handle}</p>
                </div>
                <button onClick={() => acceptRequest(req.id, req.requester as any)} disabled={acceptLoading === req.id} className="bg-bite-teal text-white text-xs font-bold font-body px-4 py-2 rounded-2xl btn-press shadow-teal disabled:opacity-50">
                  {acceptLoading === req.id ? '...' : '承認'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div className="bg-white rounded-[2rem] p-5 shadow-bubbly">
        <h2 className="font-display text-xl text-bite-purple mb-3">友達 ({friends.length}) 👥</h2>
        {friends.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🍽️</div>
            <p className="text-gray-400 text-sm font-body">まだ友達がいないよ！上から探してみて</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {friends.map(f => {
              const rank = getRank(f.streak)
              return (
                <Link key={f.id} href={`/profile/${f.id}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                  <Avatar char={f.icon_char} bgColor={f.icon_bg_color} textColor={f.icon_text_color} size="sm" name={f.nickname} />
                  <div className="flex-1">
                    <p className="font-bold text-sm font-body text-gray-800">{f.nickname}</p>
                    <p className="text-xs text-gray-400 font-body">@{f.user_handle}</p>
                  </div>
                  <span className="text-xs font-bold font-body px-2.5 py-1 rounded-full" style={{ backgroundColor: rank.bgColor, color: rank.color }}>
                    {rank.emoji} {rank.name}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
