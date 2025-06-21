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
    <div className="min-h-screen bg-pure-black noise flex items-center justify-center p-6">
      <InteractiveCursor />
      
      {/* Back to landing */}
      <Link 
        to="/" 
        className="fixed top-8 left-8 z-50 flex items-center space-x-3 nav-item-brutal"
        data-cursor-interactive
      >
        <ArrowLeft size={20} />
        <span className="text-sm">BACK TO HOME</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-4 mb-8 group">
            <div className="w-16 h-16 bg-primary flex items-center justify-center relative overflow-hidden">
              <span className="text-pure-white font-black text-2xl font-mono">U</span>
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-pure-white font-display uppercase tracking-tight">UseThis</h1>
              <div className="text-xs text-primary font-mono uppercase tracking-widest">PLATFORM</div>
            </div>
          </div>
          <div className="divider-brutal mb-6" />
          <p className="text-steel text-lg font-display font-bold uppercase tracking-wide">
            {isSignUp ? "JOIN THE REVOLUTION" : "WELCOME BACK"}
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-big font-black text-pure-white mb-4 font-display">
                {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
              </h2>
              <p className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                {isSignUp 
                  ? "START YOUR JOURNEY IN THE STUDENT ECONOMY" 
                  : "ACCESS YOUR RENTAL MARKETPLACE"
                }
              </p>
            </div>

            {error && (
              <div className="p-4 bg-crimson border-2 border-crimson">
                <p className="text-pure-white font-bold uppercase tracking-wide text-sm">{error}</p>
              </div>
            )}

            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel" size={20} />
                <Input
                  label="FULL NAME"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ENTER YOUR FULL NAME"
                  className="pl-12"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel" size={20} />
              <Input
                label="EMAIL ADDRESS"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER YOUR EMAIL"
                className="pl-12"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel" size={20} />
              <Input
                label="PASSWORD"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER YOUR PASSWORD"
                className="pl-12"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-cursor-interactive="true"
            >
              {loading 
                ? (isSignUp ? "CREATING ACCOUNT..." : "SIGNING IN...") 
                : (isSignUp ? "CREATE ACCOUNT" : "SIGN IN")
              }
            </Button>

            <div className="text-center">
              <div className="divider-brutal mb-6" />
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                data-cursor-interactive="true"
                className="nav-item-brutal text-sm"
              >
                {isSignUp 
                  ? "ALREADY HAVE AN ACCOUNT? SIGN IN" 
                  : "NEED AN ACCOUNT? SIGN UP"
                }
              </button>
            </div>
          </form>
        </Card>

        <div className="text-center mt-12">
          <p className="text-steel text-xs font-display font-bold uppercase tracking-wide">
            BY CONTINUING, YOU AGREE TO OUR{' '}
            <button className="text-primary hover:underline nav-item-brutal" data-cursor-interactive>
              TERMS OF SERVICE
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