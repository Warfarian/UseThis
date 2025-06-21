import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { InteractiveCursor } from '../components/InteractiveCursor'
import { ArrowLeft, Lock, Mail, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name)
        if (error) throw error
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pure-black noise flex items-center justify-center p-6 relative">
      <InteractiveCursor />
      
      {/* Back to landing - Fixed positioning */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 flex items-center space-x-3 nav-item-brutal bg-charcoal px-4 py-2 border-2 border-steel hover:border-primary"
        data-cursor-interactive
      >
        <ArrowLeft size={18} />
        <span className="text-xs">BACK</span>
      </Link>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-4 mb-6 group">
            <div className="w-16 h-16 bg-primary flex items-center justify-center relative overflow-hidden">
              <span className="text-pure-white font-black text-2xl font-mono">U</span>
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-pure-white font-display uppercase tracking-tight">UseThis</h1>
              <div className="text-xs text-primary font-mono uppercase tracking-widest">PLATFORM</div>
            </div>
          </div>
          <div className="divider-brutal mb-4" />
          <p className="text-steel text-base font-display font-bold uppercase tracking-wide">
            {isSignUp ? "JOIN THE REVOLUTION" : "WELCOME BACK"}
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-pure-white mb-3 font-display uppercase">
                {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
              </h2>
              <p className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                {isSignUp 
                  ? "START YOUR JOURNEY" 
                  : "ACCESS YOUR ACCOUNT"
                }
              </p>
            </div>

            {error && (
              <div className="p-4 bg-crimson/20 border-2 border-crimson">
                <p className="text-crimson font-bold uppercase tracking-wide text-sm">{error}</p>
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <Input
                  label="FULL NAME"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ENTER YOUR FULL NAME"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Input
                label="EMAIL ADDRESS"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                label="PASSWORD"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER YOUR PASSWORD"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-8"
              disabled={loading}
              data-cursor-interactive="true"
            >
              {loading 
                ? (isSignUp ? "CREATING..." : "SIGNING IN...") 
                : (isSignUp ? "CREATE ACCOUNT" : "SIGN IN")
              }
            </Button>

            <div className="text-center pt-6">
              <div className="divider-brutal mb-6" />
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                data-cursor-interactive="true"
                className="nav-item-brutal text-sm"
              >
                {isSignUp 
                  ? "ALREADY HAVE ACCOUNT? SIGN IN" 
                  : "NEED ACCOUNT? SIGN UP"
                }
              </button>
            </div>
          </form>
        </Card>

        {/* Terms Footer */}
        <div className="text-center">
          <p className="text-steel text-xs font-display font-bold uppercase tracking-wide leading-relaxed">
            BY CONTINUING, YOU AGREE TO OUR{' '}
            <button className="text-primary hover:underline nav-item-brutal" data-cursor-interactive>
              TERMS
            </button>{' '}
            AND{' '}
            <button className="text-primary hover:underline nav-item-brutal" data-cursor-interactive>
              PRIVACY POLICY
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}