import React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-ink font-body">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-6 py-4 bg-transparent border border-ink/20 rounded-2xl',
          'text-ink placeholder-focus focus:border-accent-1 focus:outline-none',
          'transition-all duration-300 font-body',
          'hover:border-ink/40',
          error && 'border-accent-1',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-accent-1 font-body">{error}</p>
      )}
    </div>
  )
}