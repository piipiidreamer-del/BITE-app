'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ReactionEmoji } from '@/lib/types/database'
import { cn } from '@/lib/utils/cn'

const REACTIONS: { emoji: string; key: ReactionEmoji }[] = [
  { emoji: '🤤', key: 'drool' },
  { emoji: '🥺', key: 'plead' },
  { emoji: '😐', key: 'neutral' },
]

interface Props {
  postId: string
  myReaction: ReactionEmoji | null
  counts: Record<ReactionEmoji, number>
  myUserId: string
}

export default function ReactionBar({ postId, myReaction: initialReaction, counts: initialCounts, myUserId }: Props) {
  const [myReaction, setMyReaction] = useState(initialReaction)
  const [counts, setCounts] = useState(initialCounts)

  async function toggleReaction(emoji: ReactionEmoji) {
    const supabase = createClient()
    if (myReaction === emoji) {
      await supabase.from('reactions').delete().eq('post_id', postId).eq('user_id', myUserId)
      setCounts(prev => ({ ...prev, [emoji]: Math.max(0, prev[emoji] - 1) }))
      setMyReaction(null)
    } else {
      if (myReaction) {
        await supabase.from('reactions').delete().eq('post_id', postId).eq('user_id', myUserId)
        setCounts(prev => ({ ...prev, [myReaction]: Math.max(0, prev[myReaction] - 1) }))
      }
      await supabase.from('reactions').upsert({ post_id: postId, user_id: myUserId, emoji })
      setCounts(prev => ({ ...prev, [emoji]: prev[emoji] + 1 }))
      setMyReaction(emoji)
    }
  }

  const total = Object.values(counts).reduce((a,b) => a+b, 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {REACTIONS.map(({ emoji, key }) => {
          const active = myReaction === key
          return (
            <button
              key={key}
              onClick={() => toggleReaction(key)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl text-2xl font-bold transition-all btn-press',
                active
                  ? 'bg-bite-purple text-white shadow-purple scale-105'
                  : 'bg-gray-50 hover:bg-bite-purple/10'
              )}
            >
              <span>{emoji}</span>
              <span className={cn('text-xs font-body', active ? 'text-white' : 'text-gray-500')}>{counts[key]}</span>
            </button>
          )
        })}
      </div>
      {total > 0 && (
        <p className="text-center text-xs text-gray-400 font-body">{total}人がリアクション ✨</p>
      )}
    </div>
  )
}
