import React, { useState, useEffect } from 'react'

export const InteractiveCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsInteractive(true)
    const handleMouseLeave = () => setIsInteractive(false)

    // Add mouse move listener
    document.addEventListener('mousemove', updatePosition)

    // Add listeners for interactive elements
    const interactiveElements = document.querySelectorAll('[data-cursor-interactive]')
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <div
      className={`custom-cursor ${isInteractive ? 'interactive' : ''}`}
      style={{
        left: `${position.x - 10}px`,
        top: `${position.y - 10}px`,
      }}
    />
  )
}