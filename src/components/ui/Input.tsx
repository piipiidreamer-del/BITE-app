import { cn } from '@/lib/utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-bold text-gray-700 font-body">{label}</label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bite-purple font-bold font-body">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-3 font-body text-gray-800',
              'focus:outline-none focus:border-bite-teal transition-colors',
              'placeholder:text-gray-400',
              prefix && 'pl-8',
              error && 'border-red-400',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 font-body">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
