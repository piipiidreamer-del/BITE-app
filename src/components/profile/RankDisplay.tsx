import { getRank } from '@/lib/utils/rank'

interface Props { streak: number; showProgress?: boolean }

export default function RankDisplay({ streak, showProgress = false }: Props) {
  const rank = getRank(streak)
  const progress = rank.nextAt ? Math.min(100, (streak / rank.nextAt) * 100) : 100

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Rank badge */}
      <div
        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold font-body text-sm shadow-bubbly"
        style={{ backgroundColor: rank.bgColor, color: rank.color, boxShadow: `0 4px 20px -2px ${rank.color}50` }}
      >
        <span className="text-xl">{rank.emoji}</span>
        <span>{rank.name}</span>
      </div>
      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl">🔥</span>
        <span className="streak-number text-3xl font-display">{streak}</span>
        <span className="text-sm text-gray-500 font-body font-semibold">日連続</span>
      </div>
      {/* Description */}
      <p className="text-xs text-gray-400 font-body">{rank.description}</p>
      {/* Progress to next rank */}
      {showProgress && rank.nextAt && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-xs text-gray-400 font-body mb-1">
            <span>{streak}日</span>
            <span>次のランク：{rank.nextAt}日</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: rank.color }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
