import React, { useState, useEffect } from 'react'

export const InteractiveCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (target && target instanceof Element && target.hasAttribute('data-cursor-interactive')) {
        setIsInteractive(true)
      }
    }

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement
      if (target && target instanceof Element && target.hasAttribute('data-cursor-interactive')) {
        setIsInteractive(false)
      }
    }

    const handleMouseOut = () => {
      setIsVisible(false)
    }

    // Add mouse move listener
    document.addEventListener('mousemove', updatePosition, { passive: true })
    document.addEventListener('mouseout', handleMouseOut)

    // Use event delegation for interactive elements
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className={`custom-cursor ${isInteractive ? 'interactive' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  )
}