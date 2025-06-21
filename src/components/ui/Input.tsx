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
    <div className="space-y-4">
      {label && (
        <label className="block caption text-focus font-body">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-6 py-4 bg-transparent border-2 border-focus rounded-none',
          'text-ink placeholder-focus focus:border-accent-1 focus:outline-none focus-ring',
          'transition-all duration-300 font-body',
          'hover:border-accent-1/50',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 font-body">{error}</p>
      )}
    </div>
  )
}