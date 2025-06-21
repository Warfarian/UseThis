import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'electric' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'electric',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-display font-bold transition-all duration-100 inline-flex items-center justify-center focus-brutal relative overflow-hidden'
  
  const variantClasses = {
    electric: 'btn-electric',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  }
  
  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-6 text-lg'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}