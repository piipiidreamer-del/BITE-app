'use client'
import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import type { Post, ReactionEmoji } from '@/lib/types/database'
import FeedCard from './FeedCard'

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
  const [viewedIndices, setViewedIndices] = useState<Set<number>>(new Set())

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
        <div className="text-6xl">🍽️</div>
        <h3 className="font-display text-2xl text-bite-purple">No bites yet!</h3>
        <p className="font-body text-gray-500 text-sm">Add some friends to see their meals here.</p>
      </div>
    )
  }

  function handleNext() {
    setViewedIndices(prev => new Set(prev).add(currentIndex))
    setCurrentIndex(prev => Math.min(prev + 1, posts.length - 1))
  }

  const visibleCards = posts.slice(currentIndex, currentIndex + 3)

  return (
    <div className="relative w-full h-full">
      {visibleCards.map((post, i) => (
        <FeedCard
          key={post.id}
          post={post}
          myUserId={myUserId}
          myReaction={post.myReaction}
          reactionCounts={post.reactionCounts}
          isViewed={viewedIndices.has(currentIndex + i)}
          onNext={handleNext}
          stackIndex={i}
        />
      ))}
      {currentIndex >= posts.length && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-6xl">🎉</div>
          <h3 className="font-display text-2xl text-bite-purple">You&apos;re all caught up!</h3>
          <p className="font-body text-gray-500 text-sm">Come back tomorrow for more bites.</p>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {posts.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? 'bg-bite-purple w-4' : viewedIndices.has(i) ? 'bg-gray-300' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
