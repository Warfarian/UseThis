import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-display font-bold transition-all duration-100 inline-flex items-center justify-center focus-brutal relative overflow-hidden'
  
  const variantClasses = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm',
    md: 'px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base',
    lg: 'px-8 py-4 text-base sm:px-12 sm:py-6 sm:text-lg'
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