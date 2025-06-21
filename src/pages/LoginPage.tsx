import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { InteractiveCursor } from '../components/InteractiveCursor'

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
    <div className="min-h-screen bg-canvas grain flex items-center justify-center p-6">
      <InteractiveCursor />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-1 to-accent-2 rounded-full flex items-center justify-center animate-float">
              <span className="text-canvas font-bold text-2xl font-primary">U</span>
            </div>
            <h1 className="text-5xl font-bold text-ink font-primary">UseThis</h1>
          </div>
          <p className="text-focus text-lg font-body">
            {isSignUp ? "Join the community" : "Welcome back"}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-ink mb-3 font-primary">
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>
              <p className="text-focus font-body">
                {isSignUp 
                  ? "Start borrowing and lending with your peers" 
                  : "Access your rental marketplace"
                }
              </p>
            </div>

            {error && (
              <div className="p-4 bg-accent-1/10 border border-accent-1/30 rounded-2xl">
                <p className="text-accent-1 text-sm font-body">{error}</p>
              </div>
            )}

            {isSignUp && (
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

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
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                data-cursor-interactive="true"
                className="text-focus hover:text-accent-1 transition-colors font-body"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Need an account? Sign up"
                }
              </button>
            </div>
          </form>
        </Card>

        <div className="text-center mt-8">
          <p className="text-focus text-sm font-body">
            By continuing, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  )
}