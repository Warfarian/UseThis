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
        <label className="block caption text-gray-300 font-body">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-6 py-4 bg-transparent border-2 border-gray-700 rounded-none',
          'text-pure-white placeholder-gray-500 focus:border-cyan focus:outline-none focus-ring',
          'transition-all duration-300 font-body',
          'hover:border-gray-600',
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