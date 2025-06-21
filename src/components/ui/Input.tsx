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
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 bg-transparent border border-ink/30 rounded-2xl',
          'text-ink placeholder-focus focus:border-accent-1 focus:outline-none',
          'transition-colors duration-200',
          error && 'border-accent-2',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-accent-2">{error}</p>
      )}
    </div>
  )
}