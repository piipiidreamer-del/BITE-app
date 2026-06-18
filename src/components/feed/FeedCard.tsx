'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/types/database'
import Avatar from '@/components/ui/Avatar'
import type { ReactionEmoji } from '@/lib/types/database'
import ReactionBar from '@/components/post/ReactionBar'
import { cn } from '@/lib/utils/cn'

interface Props {
  post: Post
  myUserId: string
  myReaction: ReactionEmoji | null
  reactionCounts: Record<ReactionEmoji, number>
  isViewed: boolean
  onNext: () => void
  stackIndex: number
}

export default function FeedCard({ post, myUserId, myReaction, reactionCounts, isViewed, onNext, stackIndex }: Props) {
  const [flipped, setFlipped] = useState(false)

  const profile = post.profiles

  const stackStyle = {
    zIndex: 10 - stackIndex,
    transform: stackIndex === 0
      ? 'none'
      : `translateY(${stackIndex * 8}px) scale(${1 - stackIndex * 0.03})`,
  }

  return (
    <div
      style={stackStyle}
      className={cn(
        'absolute inset-0 rounded-4xl overflow-hidden transition-all duration-300',
        isViewed && 'opacity-70'
      )}
    >
      <div
        className="w-full h-full perspective-1000"
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="w-full h-full transform-style-3d relative"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-4xl overflow-hidden shadow-bubbly flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
              <Avatar
                char={profile?.icon_char}
                bgColor={profile?.icon_bg_color}
                textColor={profile?.icon_text_color}
                size="sm"
              />
              <div>
                <p className="font-bold font-body text-gray-800 text-sm">{profile?.nickname}</p>
                <p className="text-xs text-gray-400 font-body">@{profile?.user_handle}</p>
              </div>
              <div className="ml-auto text-xs text-gray-400 font-body">
                {new Date(post.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* Triple images */}
            <div className="flex-1 px-3 pb-3 flex flex-col gap-1 overflow-hidden">
              {[post.image_top, post.image_middle, post.image_bottom].map((src, i) => (
                <div key={i} className="relative flex-1 rounded-2xl overflow-hidden">
                  <Image src={src} alt="" fill className="object-cover" sizes="430px" />
                </div>
              ))}
            </div>

            <div className="px-4 pb-3 text-xs text-gray-400 font-body text-center">
              Tap to react 💬
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rotate-y-180 backface-hidden bg-white rounded-4xl overflow-hidden shadow-bubbly flex flex-col p-4 gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Avatar char={profile?.icon_char} bgColor={profile?.icon_bg_color} textColor={profile?.icon_text_color} size="sm" />
              <div>
                <p className="font-bold font-body text-sm">{profile?.nickname}</p>
                {post.caption && <p className="text-xs text-gray-500 font-body">{post.caption}</p>}
              </div>
            </div>

            <ReactionBar postId={post.id} myReaction={myReaction} counts={reactionCounts} myUserId={myUserId} />

            <Link
              href={`/post/${post.id}`}
              className="text-xs text-bite-purple font-bold font-body text-center hover:underline"
            >
              View full post + comments →
            </Link>

            <button
              onClick={onNext}
              className="mt-auto w-full bg-bite-gradient text-white font-bold font-body py-3 rounded-3xl active:scale-95 transition-transform"
            >
              Next 👉
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
