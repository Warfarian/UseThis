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
        'card-brutal',
        hover && 'hover-brutal',
        className
      )}
      data-cursor-interactive="true"
    >
      {children}
    </div>
  )
}