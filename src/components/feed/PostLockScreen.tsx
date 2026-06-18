import Link from 'next/link'

export default function PostLockScreen() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center gap-6">
      <div className="relative">
        <div className="w-28 h-28 rounded-[2rem] bg-bite-purple/10 flex items-center justify-center text-6xl float">🔒</div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-bite-teal rounded-full flex items-center justify-center text-xl shadow-teal">📸</div>
      </div>
      <div>
        <h2 className="font-display text-3xl text-bite-purple mb-2">今日のBiteを投稿してから見よう！</h2>
        <p className="font-body text-gray-400 text-sm leading-relaxed">
          友達の投稿は自分が<br/>投稿してから見られるよ 🍽️
        </p>
      </div>

      {/* Progress visual */}
      <div className="w-full bg-white rounded-[1.5rem] p-4 shadow-bubbly flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-0 bg-bite-gradient rounded-full" />
        </div>
        <span className="text-xs text-gray-400 font-body font-bold">0 / 3</span>
      </div>

      <Link href="/create" className="w-full">
        <div className="bg-gradient-to-r from-bite-purple to-bite-purple-light text-white font-bold font-body text-lg py-4 px-8 rounded-[2rem] shadow-purple btn-press text-center">
          Biteを投稿する 🚀
        </div>
      </Link>
    </div>
  )
}
