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
        <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display">
          {label}
        </label>
      )}
      <input
        className={cn(
          'input-brutal w-full',
          error && 'border-crimson',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-crimson font-bold uppercase tracking-wide">{error}</p>
      )}
    </div>
  )
}