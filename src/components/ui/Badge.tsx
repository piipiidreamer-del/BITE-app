import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  label: string
  emoji: string
  color?: string
  className?: string
}

export default function Badge({ label, emoji, color = '#7C3AED', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-body text-white',
        className
      )}
      style={{ backgroundColor: color }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  )
}
