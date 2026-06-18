import { getRank } from '@/lib/utils/rank'
import Badge from '@/components/ui/Badge'

interface Props {
  streak: number
}

export default function RankDisplay({ streak }: Props) {
  const rank = getRank(streak)
  return (
    <div className="flex flex-col items-center gap-1">
      <Badge label={rank.name} emoji={rank.emoji} color={rank.color} />
      <p className="text-xs font-body text-gray-500">🔥 {streak} day streak</p>
    </div>
  )
}
