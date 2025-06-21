import React from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  hover = true 
}) => {
  return (
    <div
      className={cn(
        'glass-card rounded-none p-8 transition-all duration-300',
        hover && 'hover:border-accent-1/30 hover:shadow-2xl hover:shadow-accent-1/10',
        className
      )}
      data-cursor-interactive="true"
    >
      {children}
    </div>
  )
}