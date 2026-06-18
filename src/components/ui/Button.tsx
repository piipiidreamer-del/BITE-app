import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'teal' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-bite-gradient text-white shadow-teal hover:shadow-purple',
  teal: 'bg-bite-teal text-white shadow-teal hover:bg-bite-teal-dark',
  secondary: 'bg-white text-bite-purple border-2 border-bite-purple/30 shadow-bubbly hover:border-bite-purple',
  ghost: 'bg-bite-teal-light text-bite-teal-dark hover:bg-bite-teal/20',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-2xl',
  md: 'px-6 py-3.5 text-base rounded-3xl',
  lg: 'px-8 py-4 text-lg rounded-[2rem]',
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
        'btn-press',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  )
}
