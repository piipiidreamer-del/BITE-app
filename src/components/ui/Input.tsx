import { cn } from '@/lib/utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-bold text-gray-600 font-body tracking-wide">{label}</label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bite-teal font-bold font-body text-base">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white border-2 border-bite-teal/30 rounded-2xl px-4 py-3.5 font-body text-gray-800 text-base',
              'focus:outline-none focus:border-bite-teal focus:shadow-[0_0_0_4px_rgba(13,211,197,0.15)]',
              'placeholder:text-gray-300 transition-all duration-200',
              prefix && 'pl-9',
              error && 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]',
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="text-xs text-gray-400 font-body">{hint}</p>}
        {error && <p className="text-xs text-red-500 font-body font-semibold">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
