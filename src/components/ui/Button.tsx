import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-bite-gradient text-white shadow-bubbly hover:opacity-90 active:scale-95',
  secondary: 'bg-white text-bite-purple border-2 border-bite-purple hover:bg-bite-purple hover:text-white active:scale-95',
  ghost: 'bg-transparent text-bite-purple hover:bg-bite-purple/10 active:scale-95',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-2xl',
  md: 'px-6 py-3 text-base rounded-3xl',
  lg: 'px-8 py-4 text-lg rounded-3xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-body font-bold transition-all duration-150 flex items-center justify-center gap-2 w-full',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  )
}
