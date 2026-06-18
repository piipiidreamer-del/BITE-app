import { cn } from '@/lib/utils/cn'

interface AvatarProps {
  char?: string
  bgColor?: string
  textColor?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  ring?: boolean
  name?: string  // full name for larger sizes
}

const sizes = {
  xs:  { outer: 'w-9 h-9  rounded-xl  text-xs',  inner: 'w-7  h-7  rounded-lg  text-xs'  },
  sm:  { outer: 'w-12 h-12 rounded-2xl text-sm',  inner: 'w-9  h-9  rounded-xl  text-sm'  },
  md:  { outer: 'w-16 h-16 rounded-3xl text-base', inner: 'w-12 h-12 rounded-2xl text-sm'  },
  lg:  { outer: 'w-22 h-22 rounded-[1.5rem] text-xl', inner: 'w-16 h-16 rounded-3xl text-base' },
  xl:  { outer: 'w-32 h-32 rounded-[2rem] text-3xl',  inner: 'w-24 h-24 rounded-[1.75rem] text-2xl' },
}

export default function Avatar({
  char = 'B',
  bgColor = '#7C3AED',
  textColor = '#ffffff',
  size = 'md',
  className,
  ring = false,
  name,
}: AvatarProps) {
  const s = sizes[size]
  // Display text: use short name if available and size is large enough
  const displayText = (name && (size === 'lg' || size === 'xl'))
    ? name.slice(0, 6)
    : char

  return (
    <div
      className={cn(
        'flex items-center justify-center shrink-0 shadow-bubbly',
        s.outer,
        ring && 'ring-4 ring-bite-purple ring-offset-2',
        className
      )}
      style={{ backgroundColor: '#E8F5FF' /* teal-ish outer frame */ }}
    >
      <div
        className={cn(
          'flex items-center justify-center font-display font-bold',
          s.inner,
          'shadow-inner'
        )}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {displayText}
      </div>
    </div>
  )
}
