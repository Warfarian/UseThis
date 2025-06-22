import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { Home, Search, Plus, Calendar, User, LogOut, MessageSquare, HelpCircle, Menu, X, Star, Info, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const primaryNavItems = [
    { path: '/home', icon: Home, label: 'HOME' },
    { path: '/browse', icon: Search, label: 'BROWSE' },
    { path: '/add-listing', icon: Plus, label: 'LIST' },
    { path: '/bookings', icon: Calendar, label: 'BOOKINGS' },
  ]

  const communicationItems = [
    { path: '/messages', icon: MessageSquare, label: 'MESSAGES' },
    { path: '/inquiries', icon: HelpCircle, label: 'INQUIRIES' },
  ]

  const accountItems = [
    { path: '/reviews', icon: Star, label: 'REVIEWS' },
    { path: '/profile', icon: User, label: 'PROFILE' },
  ]

  const helpItems = [
    { path: '/faq', icon: Info, label: 'FAQ' },
  ]

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const isActiveInGroup = (items: any[]) => {
    return items.some(item => location.pathname === item.path)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] nav-brutal">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - Responsive width */}
            <div className="flex-shrink-0 w-32 sm:w-48">
              <Link 
                to="/home" 
                className="flex items-center space-x-2 sm:space-x-3 group"
                data-cursor-interactive="true"
                onClick={closeMobileMenu}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary flex items-center justify-center relative overflow-hidden">
                  <span className="text-pure-white font-black text-sm sm:text-lg lg:text-2xl font-mono">U</span>
                  <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg sm:text-xl lg:text-2xl font-black text-pure-white font-display uppercase tracking-tight">UseThis</span>
                  <div className="text-xs text-primary font-mono uppercase tracking-widest">BETA</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Items - Hidden on mobile/tablet */}
            {user && (
              <div className="hidden xl:flex items-center justify-center flex-1 max-w-4xl mx-8">
                <div className="flex items-center space-x-1">
                  {/* Primary Navigation */}
                  {primaryNavItems.map(({ path, icon: Icon, label }) => (
                    <Link
                      key={path}
                      to={path}
                      data-cursor-interactive="true"
                      className={cn(
                        'nav-item-brutal flex items-center space-x-1 py-2 px-3 whitespace-nowrap transition-all duration-100',
                        location.pathname === path 
                          ? 'text-primary border-b-2 border-primary' 
                          : 'text-pure-white hover:text-primary'
                      )}
                    >
                      <Icon size={14} />
                      <span className="text-xs font-bold">{label}</span>
                    </Link>
                  ))}

                  {/* Communication Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown('communication')}
                      data-cursor-interactive="true"
                      className={cn(
                        'nav-item-brutal flex items-center space-x-1 py-2 px-3 whitespace-nowrap transition-all duration-100',
                        isActiveInGroup(communicationItems) || activeDropdown === 'communication'
                          ? 'text-primary border-b-2 border-primary' 
                          : 'text-pure-white hover:text-primary'
                      )}
                    >
                      <MessageSquare size={14} />
                      <span className="text-xs font-bold">CHAT</span>
                      <ChevronDown size={12} className={cn(
                        'transition-transform duration-200',
                        activeDropdown === 'communication' ? 'rotate-180' : ''
                      )} />
                    </button>
                    
                    {activeDropdown === 'communication' && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-charcoal border-2 border-primary shadow-lg z-50">
                        {communicationItems.map(({ path, icon: Icon, label }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setActiveDropdown(null)}
                            className={cn(
                              'flex items-center space-x-2 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors',
                              location.pathname === path
                                ? 'text-primary bg-primary/10 border-l-4 border-primary'
                                : 'text-pure-white hover:text-primary hover:bg-primary/5'
                            )}
                          >
                            <Icon size={14} />
                            <span>{label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Account Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown('account')}
                      data-cursor-interactive="true"
                      className={cn(
                        'nav-item-brutal flex items-center space-x-1 py-2 px-3 whitespace-nowrap transition-all duration-100',
                        isActiveInGroup(accountItems) || activeDropdown === 'account'
                          ? 'text-primary border-b-2 border-primary' 
                          : 'text-pure-white hover:text-primary'
                      )}
                    >
                      <User size={14} />
                      <span className="text-xs font-bold">ACCOUNT</span>
                      <ChevronDown size={12} className={cn(
                        'transition-transform duration-200',
                        activeDropdown === 'account' ? 'rotate-180' : ''
                      )} />
                    </button>
                    
                    {activeDropdown === 'account' && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-charcoal border-2 border-primary shadow-lg z-50">
                        {accountItems.map(({ path, icon: Icon, label }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setActiveDropdown(null)}
                            className={cn(
                              'flex items-center space-x-2 px-4 py-3 text-xs font-bold uppercase tracking-wide transition-colors',
                              location.pathname === path
                                ? 'text-primary bg-primary/10 border-l-4 border-primary'
                                : 'text-pure-white hover:text-primary hover:bg-primary/5'
                            )}
                          >
                            <Icon size={14} />
                            <span>{label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Help Items */}
                  {helpItems.map(({ path, icon: Icon, label }) => (
                    <Link
                      key={path}
                      to={path}
                      data-cursor-interactive="true"
                      className={cn(
                        'nav-item-brutal flex items-center space-x-1 py-2 px-3 whitespace-nowrap transition-all duration-100',
                        location.pathname === path 
                          ? 'text-primary border-b-2 border-primary' 
                          : 'text-pure-white hover:text-primary'
                      )}
                    >
                      <Icon size={14} />
                      <span className="text-xs font-bold">{label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Right Side - User Actions and Mobile Menu */}
            <div className="flex-shrink-0 w-32 sm:w-48 flex justify-end items-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {user ? (
                  <>
                    {/* Desktop User Info - Hidden on mobile/tablet */}
                    <div className="hidden xl:flex items-center space-x-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary flex items-center justify-center">
                        <span className="text-pure-white font-black text-xs sm:text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-pure-white font-display font-bold uppercase tracking-wide text-xs">
                          WELCOME
                        </div>
                        <div className="text-steel font-mono text-xs">
                          {user.email?.split('@')[0]}
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop Sign Out - Hidden on mobile/tablet */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="hidden xl:flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4"
                      data-cursor-interactive="true"
                    >
                      <LogOut size={14} />
                      <span className="text-xs sm:text-sm">EXIT</span>
                    </Button>

                    {/* Mobile/Tablet Menu Button - Show on screens smaller than xl */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="xl:hidden p-2 text-pure-white hover:text-primary transition-colors border-2 border-steel hover:border-primary"
                      data-cursor-interactive="true"
                    >
                      {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                  </>
                ) : (
                  <Link to="/login" data-cursor-interactive="true">
                    <Button size="sm" className="text-xs sm:text-sm px-3 sm:px-4">ENTER</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Overlay - Close dropdowns when clicking outside */}
        {activeDropdown && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </nav>

      {/* Mobile/Tablet Dropdown Menu */}
      {user && mobileMenuOpen && (
        <div className="fixed top-16 sm:top-20 left-0 right-0 z-[90] xl:hidden">
          <div className="bg-charcoal border-b-2 border-primary shadow-lg">
            <div className="max-w-7xl mx-auto px-3 sm:px-6">
              {/* User Info Section */}
              <div className="py-4 border-b border-steel/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center">
                    <span className="text-pure-white font-black text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-pure-white font-display font-bold uppercase tracking-wide text-sm">
                      WELCOME BACK
                    </div>
                    <div className="text-steel font-mono text-xs">
                      {user.email?.split('@')[0]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Navigation Items */}
              <div className="py-2">
                <div className="text-primary font-display font-bold uppercase text-xs tracking-wider px-2 py-2">
                  MAIN MENU
                </div>
                {primaryNavItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    data-cursor-interactive="true"
                    className={cn(
                      'flex items-center space-x-3 py-3 px-2 transition-colors font-display text-sm border-l-4',
                      location.pathname === path
                        ? 'text-primary border-primary bg-primary/10'
                        : 'text-pure-white hover:text-primary border-transparent hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <Icon size={18} />
                    <span className="font-bold uppercase tracking-wide">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Communication Section */}
              <div className="py-2 border-t border-steel/30">
                <div className="text-accent font-display font-bold uppercase text-xs tracking-wider px-2 py-2">
                  COMMUNICATION
                </div>
                {communicationItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    data-cursor-interactive="true"
                    className={cn(
                      'flex items-center space-x-3 py-3 px-2 transition-colors font-display text-sm border-l-4',
                      location.pathname === path
                        ? 'text-primary border-primary bg-primary/10'
                        : 'text-pure-white hover:text-primary border-transparent hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <Icon size={18} />
                    <span className="font-bold uppercase tracking-wide">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Account Section */}
              <div className="py-2 border-t border-steel/30">
                <div className="text-secondary font-display font-bold uppercase text-xs tracking-wider px-2 py-2">
                  ACCOUNT
                </div>
                {accountItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    data-cursor-interactive="true"
                    className={cn(
                      'flex items-center space-x-3 py-3 px-2 transition-colors font-display text-sm border-l-4',
                      location.pathname === path
                        ? 'text-primary border-primary bg-primary/10'
                        : 'text-pure-white hover:text-primary border-transparent hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <Icon size={18} />
                    <span className="font-bold uppercase tracking-wide">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Help Section */}
              <div className="py-2 border-t border-steel/30">
                <div className="text-steel font-display font-bold uppercase text-xs tracking-wider px-2 py-2">
                  HELP
                </div>
                {helpItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    data-cursor-interactive="true"
                    className={cn(
                      'flex items-center space-x-3 py-3 px-2 transition-colors font-display text-sm border-l-4',
                      location.pathname === path
                        ? 'text-primary border-primary bg-primary/10'
                        : 'text-pure-white hover:text-primary border-transparent hover:border-primary/50 hover:bg-primary/5'
                    )}
                  >
                    <Icon size={18} />
                    <span className="font-bold uppercase tracking-wide">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Sign Out */}
              <div className="py-4 border-t border-steel/30">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 py-3 px-2 text-crimson hover:text-crimson/80 transition-colors font-display text-sm font-bold uppercase tracking-wide w-full"
                  data-cursor-interactive="true"
                >
                  <LogOut size={18} />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-pure-black/50 z-[80] xl:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  )
}