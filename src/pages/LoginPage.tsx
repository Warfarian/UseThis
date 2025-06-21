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
    <div className="min-h-screen bg-canvas grain flex items-center justify-center p-8">
      <InteractiveCursor />
      
      {/* Back to landing */}
      <Link 
        to="/" 
        className="fixed top-8 left-8 z-50 flex items-center space-x-3 text-focus hover:text-accent-1 transition-colors link-hover"
        data-cursor-interactive
      >
        <ArrowLeft size={20} />
        <span className="font-body">Back to Home</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-accent-1 rounded-sm flex items-center justify-center">
              <span className="text-canvas font-black text-2xl font-mono">U</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-ink font-primary">UseThis</h1>
              <div className="text-xs text-focus font-mono uppercase tracking-extra-wide">Platform</div>
            </div>
          </div>
          <div className="w-24 h-1 bg-accent-1 mx-auto mb-6" />
          <p className="text-focus text-lg font-body">
            {isSignUp ? "Join the community" : "Welcome back"}
          </p>
        </div>

        <Card className="p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="heading-2 font-bold text-ink mb-4 font-primary">
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>
              <p className="text-focus font-body">
                {isSignUp 
                  ? "Start sharing and borrowing today" 
                  : "Access your rental marketplace"
                }
              </p>
            </div>

            {error && (
              <div className="p-6 bg-red-500/10 border-2 border-red-500/30 rounded-none">
                <p className="text-red-400 font-body">{error}</p>
              </div>
            )}

            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-focus" size={20} />
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-12"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-focus" size={20} />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-12"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-focus" size={20} />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
                ? (isSignUp ? "Creating Account..." : "Signing In...") 
                : (isSignUp ? "Create Account" : "Sign In")
              }
            </Button>

            <div className="text-center">
              <div className="w-16 h-px bg-focus mx-auto mb-6" />
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                data-cursor-interactive="true"
                className="text-focus hover:text-accent-1 transition-colors font-body link-hover"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Need an account? Sign up"
                }
              </button>
            </div>
          </form>
        </Card>

        <div className="text-center mt-12">
          <p className="text-focus text-sm font-body">
            By continuing, you agree to our{' '}
            <button className="text-accent-1 hover:underline link-hover" data-cursor-interactive>
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-accent-1 hover:underline link-hover" data-cursor-interactive>
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}