import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/types/database'

interface Props { posts: Post[] }

export default function PostGrid({ posts }: Props) {
  if (posts.length === 0) {
    return <p className="text-center text-gray-400 font-body text-sm py-8">No posts yet 🍽️</p>
  }
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map(post => (
        <Link key={post.id} href={`/post/${post.id}`} className="relative aspect-square rounded-xl overflow-hidden">
          <Image src={post.image_top} alt="" fill className="object-cover" sizes="143px" />
        </Link>
      ))}
    </div>
  )
}
