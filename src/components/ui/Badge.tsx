import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  label: string
  emoji: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'px-3 py-1 text-xs gap-1',
  md: 'px-4 py-1.5 text-sm gap-1.5',
  lg: 'px-5 py-2 text-base gap-2',
}

export default function Badge({ label, emoji, color = '#7C3AED', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-bold font-body text-white shadow-bubbly',
        sizes[size],
        className
      )}
      style={{ backgroundColor: color, boxShadow: `0 4px 16px -2px ${color}80` }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  )
}
