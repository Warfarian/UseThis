import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
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
  const baseClasses = 'font-primary font-medium transition-all duration-200 rounded-3xl cursor-spark fuzzy-glow slot-machine'
  
  const variantClasses = {
    primary: 'bg-accent-1 text-canvas hover:bg-accent-2 shadow-lg hover:shadow-xl',
    secondary: 'bg-transparent text-ink border border-ink hover:border-accent-1 hover:text-accent-1',
    ghost: 'bg-transparent text-ink hover:text-accent-1'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
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