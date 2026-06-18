'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ReactionEmoji } from '@/lib/types/database'
import { cn } from '@/lib/utils/cn'

const REACTIONS: { emoji: string; key: ReactionEmoji; label: string }[] = [
  { emoji: '🤤', key: 'drool', label: 'Drool' },
  { emoji: '🥺', key: 'plead', label: 'Plead' },
  { emoji: '😐', key: 'neutral', label: 'Neutral' },
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

  return (
    <div className="flex items-center gap-3">
      {REACTIONS.map(({ emoji, key }) => (
        <button
          key={key}
          onClick={() => toggleReaction(key)}
          className={cn(
            'flex items-center gap-1 px-3 py-2 rounded-full text-sm font-bold font-body transition-all active:scale-90',
            myReaction === key ? 'bg-bite-purple text-white shadow-bubbly' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <span>{emoji}</span>
          <span>{counts[key]}</span>
        </button>
      ))}
    </div>
  )
}
