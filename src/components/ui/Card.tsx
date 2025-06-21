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
        'glass rounded-3xl p-6 transition-all duration-300',
        hover && 'hover:scale-105 hover:border-accent-1/30 cursor-eyeball',
        className
      )}
    >
      {children}
    </div>
  )
}