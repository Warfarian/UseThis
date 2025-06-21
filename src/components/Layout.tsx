import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas grain">
      <Navigation />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  )
}