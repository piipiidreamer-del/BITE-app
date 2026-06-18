'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { Post, ReactionEmoji } from '@/lib/types/database'
import Avatar from '@/components/ui/Avatar'
import ReactionBar from '@/components/post/ReactionBar'
import { cn } from '@/lib/utils/cn'

interface Props {
  post: Post
  myUserId: string
  myReaction: ReactionEmoji | null
  reactionCounts: Record<ReactionEmoji, number>
  isTop: boolean
  stackIndex: number   // 0 = top card
  onSwipeAway: () => void
}

export default function FeedCard({ post, myUserId, myReaction, reactionCounts, isTop, stackIndex, onSwipeAway }: Props) {
  const [showBack, setShowBack] = useState(false)
  const profile = post.profiles as any

  // Stack visual transforms
  const stackRotations = [0, -3, 2, -1.5]
  const stackTranslates = [0, 8, 16, 22]
  const stackScales = [1, 0.96, 0.92, 0.88]

  if (!isTop) {
    return (
      <div
        className="absolute inset-x-0 bg-white rounded-[2rem] shadow-card overflow-hidden"
        style={{
          top: 0,
          transform: `rotate(${stackRotations[Math.min(stackIndex, 3)]}deg) translateY(${stackTranslates[Math.min(stackIndex, 3)]}px) scale(${stackScales[Math.min(stackIndex, 3)]})`,
          zIndex: 10 - stackIndex,
        }}
      >
        {/* Peek — just show the top image */}
        <div className="relative w-full aspect-[4/3]">
          <Image src={post.image_top} alt="" fill className="object-cover" sizes="430px" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="absolute inset-x-0 z-20"
      drag="x"
      dragConstraints={{ left: -40, right: 40 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
          onSwipeAway()
        }
      }}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
    >
      <div className="perspective-1000">
        <motion.div
          className="relative transform-style-3d"
          animate={{ rotateY: showBack ? 180 : 0 }}
          transition={{ duration: 0.55, type: 'spring', stiffness: 100, damping: 18 }}
        >
          {/* ── FRONT ── */}
          <div className="backface-hidden bg-white rounded-[2rem] shadow-bubbly-lg overflow-hidden">
            {/* User header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar
                char={profile?.icon_char}
                bgColor={profile?.icon_bg_color}
                textColor={profile?.icon_text_color}
                size="sm"
                name={profile?.nickname}
              />
              <div>
                <p className="font-bold font-body text-gray-800 text-sm leading-tight">{profile?.nickname}</p>
                <p className="text-xs text-gray-400 font-body">@{profile?.user_handle}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-400 font-body">
                  {new Date(post.created_at).toLocaleTimeString('ja', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* 3 images stacked */}
            <div className="px-3 pb-3 flex flex-col gap-1">
              {[post.image_top, post.image_middle, post.image_bottom].map((src, i) => (
                <div key={i} className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: i === 0 ? '4/3' : '4/2' }}>
                  <Image src={src} alt="" fill className="object-cover" sizes="400px" />
                </div>
              ))}
            </div>

            {/* Caption preview */}
            {post.caption && (
              <div className="px-4 pb-3">
                <p className="text-sm font-body text-gray-700 line-clamp-2">{post.caption}</p>
              </div>
            )}

            {/* Tap hint */}
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-300 font-body">
                <span>←</span><span>はらって次へ</span>
              </div>
              <button
                onClick={() => setShowBack(true)}
                className="flex items-center gap-1.5 bg-bite-purple/10 text-bite-purple font-bold font-body text-xs px-3 py-2 rounded-2xl"
              >
                <span>💬</span><span>リアクション</span>
              </button>
            </div>
          </div>

          {/* ── BACK ── */}
          <div className="absolute inset-0 rotate-y-180 backface-hidden bg-white rounded-[2rem] shadow-bubbly-lg overflow-hidden flex flex-col">
            {/* Thumbnail strip */}
            <div className="flex gap-1 p-3">
              {[post.image_top, post.image_middle, post.image_bottom].map((src, i) => (
                <div key={i} className="relative flex-1 rounded-xl overflow-hidden" style={{ aspectRatio:'1' }}>
                  <Image src={src} alt="" fill className="object-cover" sizes="130px" />
                </div>
              ))}
            </div>

            <div className="px-4 flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Avatar char={profile?.icon_char} bgColor={profile?.icon_bg_color} textColor={profile?.icon_text_color} size="sm" />
                <div>
                  <p className="font-bold font-body text-sm text-gray-800">{profile?.nickname}</p>
                  {post.caption && <p className="text-xs text-gray-500 font-body">{post.caption}</p>}
                </div>
              </div>

              {/* Big reactions */}
              <ReactionBar postId={post.id} myReaction={myReaction} counts={reactionCounts} myUserId={myUserId} />

              <Link href={`/post/${post.id}`} className="text-xs text-bite-purple font-bold font-body text-center hover:underline">
                コメントを見る →
              </Link>
            </div>

            <div className="p-4 flex gap-2">
              <button
                onClick={() => setShowBack(false)}
                className="flex-1 bg-gray-100 text-gray-500 font-bold font-body py-3 rounded-2xl text-sm"
              >
                ← 戻る
              </button>
              <button
                onClick={onSwipeAway}
                className="flex-1 bg-gradient-to-r from-bite-purple to-bite-purple-light text-white font-bold font-body py-3 rounded-2xl text-sm shadow-purple btn-press"
              >
                次へ →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
