'use client'
import { useState } from 'react'
import type { Post, ReactionEmoji } from '@/lib/types/database'
import FeedCard from './FeedCard'
import Link from 'next/link'

interface PostWithMeta extends Post {
  myReaction: ReactionEmoji | null
  reactionCounts: Record<ReactionEmoji, number>
}

interface Props {
  posts: PostWithMeta[]
  myUserId: string
}

export default function FeedStack({ posts, myUserId }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-6 py-10">
        <div className="w-24 h-24 rounded-[2rem] bg-bite-purple/10 flex items-center justify-center text-5xl float">🍽️</div>
        <div>
          <h3 className="font-display text-2xl text-bite-purple mb-1">友達の投稿がないよ！</h3>
          <p className="font-body text-gray-400 text-sm">友達を追加して、みんなのBiteを見よう</p>
        </div>
        <Link href="/friends" className="bg-bite-purple text-white font-bold font-body px-6 py-3 rounded-3xl text-sm shadow-purple btn-press">
          友達を探す 👥
        </Link>
      </div>
    )
  }

  const done = currentIndex >= posts.length
  // Show up to 3 cards in the stack (top + 2 peeking behind)
  const visiblePosts = posts.slice(currentIndex, currentIndex + 3)

  return (
    <div className="flex flex-col h-full">
      {/* Counter */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-body text-gray-400">
          {done ? '全部チェック済み ✓' : `${currentIndex + 1} / ${posts.length}`}
        </span>
        <div className="flex gap-1">
          {posts.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i < currentIndex ? 'bg-gray-300 w-1.5' : i === currentIndex ? 'bg-bite-purple w-5' : 'bg-gray-200 w-1.5'}`}
            />
          ))}
        </div>
      </div>

      {/* Card stack area */}
      <div className="relative flex-1" style={{ minHeight: '520px' }}>
        {done ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center">
            <div className="text-7xl bounce-in">🎉</div>
            <div>
              <h3 className="font-display text-2xl text-bite-purple mb-1">全部見たよ！</h3>
              <p className="font-body text-gray-400 text-sm">明日また来てね 🍳</p>
            </div>
          </div>
        ) : (
          <>
            {/* Render stack in reverse so top card is last (on top) */}
            {[...visiblePosts].reverse().map((post, reversedIdx) => {
              const stackIdx = visiblePosts.length - 1 - reversedIdx
              return (
                <FeedCard
                  key={post.id}
                  post={post}
                  myUserId={myUserId}
                  myReaction={post.myReaction}
                  reactionCounts={post.reactionCounts}
                  isTop={stackIdx === 0}
                  stackIndex={stackIdx}
                  onSwipeAway={() => setCurrentIndex(i => i + 1)}
                />
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
