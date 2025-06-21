import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { Home, Search, Plus, Calendar, User, LogOut } from 'lucide-react'

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/browse', icon: Search, label: 'Browse' },
    { path: '/add-listing', icon: Plus, label: 'List Item' },
    { path: '/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3"
            data-cursor-interactive="true"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent-1 to-accent-2 rounded-full flex items-center justify-center">
              <span className="text-canvas font-bold text-lg font-primary">U</span>
            </div>
            <span className="text-3xl font-bold text-ink font-primary">UseThis</span>
          </Link>

          {/* Navigation Items */}
          {user && (
            <div className="hidden md:flex items-center space-x-12">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  data-cursor-interactive="true"
                  className={`flex items-center space-x-2 py-2 transition-all duration-300 font-body font-medium ${
                    location.pathname === path
                      ? 'text-accent-1 border-b-2 border-accent-1 pb-1'
                      : 'text-ink hover:text-accent-1'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
                data-cursor-interactive="true"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Link to="/login" data-cursor-interactive="true">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-ink/10">
          <div className="flex justify-around py-3">
            {navItems.slice(0, 4).map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                data-cursor-interactive="true"
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors font-body ${
                  location.pathname === path
                    ? 'text-accent-1'
                    : 'text-focus hover:text-accent-1'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}