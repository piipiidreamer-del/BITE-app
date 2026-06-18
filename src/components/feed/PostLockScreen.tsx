import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function PostLockScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
      <div className="text-7xl animate-bounce">🔒</div>
      <div>
        <h2 className="font-display text-3xl text-bite-purple mb-2">Post to unlock!</h2>
        <p className="font-body text-gray-500 text-sm leading-relaxed">
          Share your meal today to see what your friends are eating 🍽️
        </p>
      </div>
      <Link href="/create" className="w-full">
        <Button size="lg">Take a Bite 📸</Button>
      </Link>
    </div>
  )
}
