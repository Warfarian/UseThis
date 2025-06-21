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
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 cursor-spark">
            <div className="w-8 h-8 bg-accent-1 rounded-full flex items-center justify-center">
              <span className="text-canvas font-bold text-lg">U</span>
            </div>
            <span className="text-2xl font-bold text-ink font-primary">UseThis</span>
          </Link>

          {/* Navigation Items */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-2xl transition-all duration-200 slot-machine ${
                    location.pathname === path
                      ? 'text-accent-1 bg-accent-1/10'
                      : 'text-ink hover:text-accent-1 hover:animate-jitter'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
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
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-ink/10">
          <div className="flex justify-around py-2">
            {navItems.slice(0, 4).map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
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