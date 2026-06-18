import { cn } from '@/lib/utils/cn'

interface AvatarProps {
  char?: string
  bgColor?: string
  textColor?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: 'w-8 h-8 text-sm',
  sm: 'w-10 h-10 text-base',
  md: 'w-14 h-14 text-xl',
  lg: 'w-20 h-20 text-3xl',
  xl: 'w-28 h-28 text-5xl',
}

export default function Avatar({
  char = 'B',
  bgColor = '#7C3AED',
  textColor = '#ffffff',
  size = 'md',
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-display font-bold shadow-bubbly shrink-0',
        sizes[size],
        className
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {char}
    </div>
  )
}
