import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { Home, Search, Plus, Calendar, User, LogOut } from 'lucide-react'

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/home', icon: Home, label: 'HOME' },
    { path: '/browse', icon: Search, label: 'BROWSE' },
    { path: '/add-listing', icon: Plus, label: 'LIST' },
    { path: '/bookings', icon: Calendar, label: 'BOOKINGS' },
    { path: '/profile', icon: User, label: 'PROFILE' },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-brutal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/home" 
            className="flex items-center space-x-4 group"
            data-cursor-interactive="true"
          >
            <div className="w-12 h-12 bg-electric flex items-center justify-center relative overflow-hidden">
              <span className="text-pure-black font-black text-2xl font-mono">U</span>
              <div className="absolute inset-0 bg-hot-pink opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
            </div>
            <div>
              <span className="text-2xl font-black text-pure-white font-display uppercase tracking-tight">UseThis</span>
              <div className="text-xs text-electric font-mono uppercase tracking-widest">BETA</div>
            </div>
          </Link>

          {/* Navigation Items */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  data-cursor-interactive="true"
                  className={cn(
                    'nav-item-brutal flex items-center space-x-2 py-2',
                    location.pathname === path && 'text-electric neon-electric'
                  )}
                >
                  <Icon size={18} />
                  <span className="text-sm">{label}</span>
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
                <span>EXIT</span>
              </Button>
            ) : (
              <Link to="/login" data-cursor-interactive="true">
                <Button size="sm">ENTER</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t-2 border-steel bg-charcoal">
          <div className="flex justify-around py-3">
            {navItems.slice(0, 4).map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                data-cursor-interactive="true"
                className={cn(
                  'flex flex-col items-center py-2 px-3 transition-colors font-display text-xs',
                  location.pathname === path
                    ? 'text-electric'
                    : 'text-steel hover:text-electric'
                )}
              >
                <Icon size={20} />
                <span className="mt-1 uppercase tracking-wide">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}