import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/types/database'

interface Props { posts: Post[] }

export default function PostGrid({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-3">
        <div className="text-5xl float">🍽️</div>
        <p className="text-gray-400 font-body text-sm text-center">まだ投稿がないよ！<br/>今日のBiteを残そう 📸</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {posts.map((post, i) => (
        <Link key={post.id} href={`/post/${post.id}`} className="relative aspect-square rounded-2xl overflow-hidden shadow-card btn-press group">
          <Image src={post.image_top} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="140px" />
          {post.is_first_bite && (
            <div className="absolute top-1.5 left-1.5 bg-bite-purple text-white text-[9px] font-bold font-body px-1.5 py-0.5 rounded-full">
              1st
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
