import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { Home, Search, Plus, Calendar, User, LogOut } from 'lucide-react'

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
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
      <div className="container-max px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/home" 
            className="flex items-center space-x-4"
            data-cursor-interactive="true"
          >
            <div className="w-10 h-10 bg-cyan rounded-sm flex items-center justify-center">
              <span className="text-pure-black font-black text-lg font-mono">U</span>
            </div>
            <div>
              <span className="text-2xl font-black text-pure-white font-primary">UseThis</span>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-extra-wide">Platform</div>
            </div>
          </Link>

          {/* Navigation Items */}
          {user && (
            <div className="hidden md:flex items-center space-x-12">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  data-cursor-interactive="true"
                  className={`flex items-center space-x-3 py-2 transition-all duration-300 font-body font-medium link-hover ${
                    location.pathname === path
                      ? 'text-cyan'
                      : 'text-gray-300 hover:text-cyan'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-6">
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
        <div className="md:hidden border-t border-gray-800">
          <div className="flex justify-around py-4">
            {navItems.slice(0, 4).map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                data-cursor-interactive="true"
                className={`flex flex-col items-center py-2 px-3 rounded-sm transition-colors font-body ${
                  location.pathname === path
                    ? 'text-cyan'
                    : 'text-gray-400 hover:text-cyan'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 caption">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}