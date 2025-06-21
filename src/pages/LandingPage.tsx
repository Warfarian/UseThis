import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { InteractiveCursor } from '../components/InteractiveCursor'
import { Button } from '../components/ui/Button'
import { ArrowRight, Sparkles, Users, Shield, Zap } from 'lucide-react'

export const LandingPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Intersection Observer hooks
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: Users,
      title: "Peer-to-Peer",
      description: "Connect directly with fellow students in your community"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Built-in verification and rating system for peace of mind"
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Find what you need or list what you have in seconds"
    }
  ]

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "50K+", label: "Items Shared" },
    { number: "98%", label: "Satisfaction Rate" }
  ]

  return (
    <div className="min-h-screen bg-canvas grain overflow-hidden">
      <InteractiveCursor />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3" data-cursor-interactive>
              <div className="w-10 h-10 bg-gradient-to-br from-accent-1 to-accent-2 rounded-full flex items-center justify-center">
                <span className="text-canvas font-bold text-lg font-primary">U</span>
              </div>
              <span className="text-3xl font-bold text-ink font-primary">UseThis</span>
            </div>
            
            <Link to="/login" data-cursor-interactive>
              <Button size="sm" className="magnetic">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6" ref={heroRef}>
        {/* Animated background elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-accent-1/10 to-accent-2/10 rounded-full blur-3xl floating-element"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-accent-2/10 to-accent-1/10 rounded-full blur-3xl floating-element-delayed"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-focus/5 to-muted/5 rounded-full blur-2xl floating-element"
          style={{
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className={`mb-12 ${heroInView ? 'hero-text' : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-8">
              <Sparkles className="text-accent-1 mr-4" size={32} />
              <span className="text-accent-1 font-medium font-body tracking-wider uppercase text-sm">
                The Future of Student Sharing
              </span>
            </div>
            
            <h1 className="text-8xl md:text-[12rem] font-bold text-ink mb-8 font-primary leading-none tracking-tight">
              Share.{' '}
              <span className="text-gradient block md:inline">Borrow.</span>{' '}
              <br className="hidden md:block" />
              <span className="text-accent-2">Thrive.</span>
            </h1>
            
            <p className={`text-2xl md:text-3xl text-focus max-w-4xl mx-auto leading-relaxed font-body mb-16 ${heroInView ? 'hero-text-delay-1' : 'opacity-0'}`}>
              The peer-to-peer rental platform revolutionizing how college students 
              <span className="text-accent-1"> share resources</span> and 
              <span className="text-accent-1"> build community</span>.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center ${heroInView ? 'hero-text-delay-2' : 'opacity-0'}`}>
            <Link to="/login" data-cursor-interactive>
              <Button size="lg" className="magnetic flex items-center space-x-4 text-xl px-12 py-6">
                <span>Start Your Journey</span>
                <ArrowRight size={24} />
              </Button>
            </Link>
            <button 
              data-cursor-interactive
              className="text-ink hover:text-accent-1 transition-colors font-body text-xl flex items-center space-x-2 magnetic"
            >
              <span>Watch Demo</span>
              <div className="w-12 h-12 border border-ink/20 rounded-full flex items-center justify-center hover:border-accent-1 transition-colors">
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-ink/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent-1 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 animate-on-scroll ${featuresInView ? 'in-view' : ''}`}>
            <h2 className="text-6xl md:text-8xl font-bold text-ink mb-8 font-primary">
              Why <span className="text-gradient">UseThis</span>?
            </h2>
            <p className="text-xl text-focus font-body max-w-3xl mx-auto">
              Built by students, for students. Experience the future of campus sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div 
                key={title}
                className={`glass-card rounded-3xl p-12 text-center group animate-on-scroll stagger-${index + 1} ${featuresInView ? 'in-view' : ''}`}
                data-cursor-interactive
              >
                <div className="w-20 h-20 mx-auto mb-8 glass rounded-full flex items-center justify-center border border-accent-1/20 group-hover:border-accent-1/50 transition-all duration-500">
                  <Icon size={40} className="text-accent-1 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-3xl font-semibold text-ink mb-6 font-primary group-hover:text-accent-1 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-focus font-body text-lg leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6" ref={statsRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 animate-on-scroll ${statsInView ? 'in-view' : ''}`}>
            <h2 className="text-6xl md:text-8xl font-bold text-ink mb-8 font-primary">
              Trusted by <span className="text-gradient">Thousands</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map(({ number, label }, index) => (
              <div 
                key={label}
                className={`text-center animate-on-scroll-scale stagger-${index + 1} ${statsInView ? 'in-view' : ''}`}
              >
                <div className="text-8xl md:text-9xl font-bold text-gradient mb-4 font-primary">
                  {number}
                </div>
                <div className="text-2xl text-focus font-body">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative" ref={ctaRef}>
        <div className="max-w-5xl mx-auto text-center">
          <div className={`animate-on-scroll ${ctaInView ? 'in-view' : ''}`}>
            <h2 className="text-7xl md:text-9xl font-bold text-ink mb-8 font-primary leading-none">
              Ready to{' '}
              <span className="text-gradient">Transform</span>
              <br />
              Your Campus?
            </h2>
            <p className="text-2xl text-focus mb-16 max-w-4xl mx-auto font-body leading-relaxed">
              Join the revolution. Share what you have, find what you need, 
              and build lasting connections with your community.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-8 justify-center animate-on-scroll stagger-1 ${ctaInView ? 'in-view' : ''}`}>
              <Link to="/login" data-cursor-interactive>
                <Button size="lg" className="magnetic flex items-center space-x-4 text-xl px-16 py-8">
                  <span>Get Started Now</span>
                  <ArrowRight size={24} />
                </Button>
              </Link>
              <button 
                data-cursor-interactive
                className="text-ink hover:text-accent-1 transition-colors font-body text-xl magnetic px-8 py-4"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent-1/5 to-accent-2/5 rounded-full blur-2xl floating-element" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-2/5 to-accent-1/5 rounded-full blur-2xl floating-element-delayed" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-ink/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-1 to-accent-2 rounded-full flex items-center justify-center">
              <span className="text-canvas font-bold text-sm font-primary">U</span>
            </div>
            <span className="text-2xl font-bold text-ink font-primary">UseThis</span>
          </div>
          <p className="text-focus font-body">
            © 2025 UseThis. Built with ❤️ for students, by students.
          </p>
        </div>
      </footer>
    </div>
  )
}