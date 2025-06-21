import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { InteractiveCursor } from '../components/InteractiveCursor'
import { Button } from '../components/ui/Button'
import { ArrowRight, Sparkles, Users, Shield, Zap, TrendingUp, Award, Globe } from 'lucide-react'

export const LandingPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Intersection Observer hooks
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1, triggerOnce: true })
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
      title: "Student Network",
      description: "Connect with verified students on your campus. Share resources, build community, save money together."
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Built-in verification, ratings, and secure transactions. Your safety is our top priority."
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Find what you need in seconds. Smart search, real-time availability, instant booking."
    }
  ]

  const stats = [
    { number: "50K+", label: "Students", sublabel: "Active Users" },
    { number: "200+", label: "Universities", sublabel: "And Growing" },
    { number: "$2M+", label: "Saved", sublabel: "By Students" }
  ]

  const testimonials = [
    {
      quote: "UseThis saved me hundreds on textbooks and gear. Plus I made friends renting out my bike!",
      author: "Sarah Chen",
      role: "Stanford University"
    },
    {
      quote: "Finally, a platform that gets student life. Clean, fast, and actually useful.",
      author: "Marcus Johnson",
      role: "MIT"
    },
    {
      quote: "Love how easy it is to find what I need and make money from stuff I'm not using.",
      author: "Elena Rodriguez",
      role: "Harvard"
    }
  ]

  return (
    <div className="min-h-screen bg-canvas grain overflow-hidden">
      <InteractiveCursor />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="container-max px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4" data-cursor-interactive>
              <div className="w-12 h-12 bg-accent-1 rounded-sm flex items-center justify-center">
                <span className="text-canvas font-black text-xl font-mono">U</span>
              </div>
              <div>
                <span className="text-2xl font-black text-ink font-primary">UseThis</span>
                <div className="text-xs text-focus font-mono uppercase tracking-extra-wide">Beta</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-focus hover:text-accent-1 transition-colors font-body font-medium link-hover" data-cursor-interactive>
                About
              </button>
              <button className="text-focus hover:text-accent-1 transition-colors font-body font-medium link-hover" data-cursor-interactive>
                Features
              </button>
              <Link to="/login" data-cursor-interactive>
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8" ref={heroRef}>
        {/* Animated background elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-dashed border-muted rounded-full floating-element opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 border-2 border-focus rounded-sm floating-element-delayed opacity-10"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px) rotate(45deg)`
          }}
        />

        <div className="container-max text-center relative z-10">
          <div className={`mb-16 ${heroInView ? 'hero-text' : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-4 px-6 py-3 border border-focus rounded-full">
                <Sparkles className="text-accent-1" size={20} />
                <span className="text-focus font-mono caption">
                  Student Economy Platform
                </span>
              </div>
            </div>
            
            <h1 className="display-1 font-black text-ink mb-8 font-primary">
              SHARE.{' '}
              <span className="text-gradient">BORROW.</span>{' '}
              <br />
              <span className="text-accent-1">THRIVE.</span>
            </h1>
            
            <div className={`w-24 h-1 bg-accent-1 mx-auto mb-12 ${heroInView ? 'hero-text-delay-1' : 'opacity-0'}`} />
            
            <p className={`body-large text-focus max-w-4xl mx-auto leading-relaxed font-body mb-16 ${heroInView ? 'hero-text-delay-1' : 'opacity-0'}`}>
              The peer-to-peer platform built for students. 
              <span className="text-accent-1 font-semibold"> Share what you have</span>, 
              <span className="text-accent-1 font-semibold"> find what you need</span>, and 
              <span className="text-accent-1 font-semibold"> build community</span>.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 ${heroInView ? 'hero-text-delay-2' : 'opacity-0'}`}>
            <Link to="/login" data-cursor-interactive>
              <Button size="lg" className="flex items-center space-x-4 text-lg px-12 py-6">
                <span>Join UseThis</span>
                <ArrowRight size={20} />
              </Button>
            </Link>
            <button 
              data-cursor-interactive
              className="btn-secondary px-12 py-6 text-lg"
            >
              Watch Demo
            </button>
          </div>

          {/* Metrics bar */}
          <div className={`flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 ${heroInView ? 'hero-text-delay-3' : 'opacity-0'}`}>
            <div className="text-center">
              <div className="text-4xl font-black text-accent-1 font-mono mb-2">50K+</div>
              <div className="text-focus caption">Active Users</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-focus" />
            <div className="text-center">
              <div className="text-4xl font-black text-accent-1 font-mono mb-2">200+</div>
              <div className="text-focus caption">Universities</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-focus" />
            <div className="text-center">
              <div className="text-4xl font-black text-accent-1 font-mono mb-2">$2M+</div>
              <div className="text-focus caption">Student Savings</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-12 border-2 border-focus rounded-full flex justify-center">
            <div className="w-1 h-4 bg-accent-1 rounded-full mt-2 pulse-indicator" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding px-8 relative" ref={featuresRef}>
        <div className="container-max">
          <div className={`text-center mb-24 animate-on-scroll ${featuresInView ? 'in-view' : ''}`}>
            <div className="caption text-accent-1 mb-6 tracking-extra-wide">How It Works</div>
            <h2 className="display-2 font-black text-ink mb-8 font-primary">
              Built for{' '}
              <span className="text-gradient">Students</span>
            </h2>
            <div className="w-32 h-1 bg-accent-1 mx-auto mb-8" />
            <p className="body-large text-focus font-body max-w-3xl mx-auto">
              Everything you need to share resources and build community on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div 
                key={title}
                className={`glass-card rounded-none p-12 text-center group animate-on-scroll stagger-${index + 1} ${featuresInView ? 'in-view' : ''}`}
                data-cursor-interactive
              >
                <div className="w-20 h-20 mx-auto mb-8 border-2 border-focus rounded-sm flex items-center justify-center group-hover:border-accent-1 transition-all duration-300">
                  <Icon size={36} className="text-focus group-hover:text-accent-1 transition-colors duration-300" />
                </div>
                <h3 className="heading-2 font-bold text-ink mb-6 font-primary group-hover:text-accent-1 transition-colors duration-300">
                  {title}
                </h3>
                <div className="w-16 h-1 bg-focus mx-auto mb-6 group-hover:bg-accent-1 transition-colors duration-300" />
                <p className="text-focus font-body leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding px-8 bg-muted" ref={statsRef}>
        <div className="container-max">
          <div className={`text-center mb-20 animate-on-scroll ${statsInView ? 'in-view' : ''}`}>
            <div className="caption text-accent-1 mb-6 tracking-extra-wide">The Numbers</div>
            <h2 className="display-2 font-black text-ink mb-8 font-primary">
              Trusted by{' '}
              <span className="text-gradient">Thousands</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {stats.map(({ number, label, sublabel }, index) => (
              <div 
                key={label}
                className={`text-center animate-on-scroll-scale stagger-${index + 1} ${statsInView ? 'in-view' : ''}`}
              >
                <div className="display-1 font-black text-accent-1 mb-4 font-mono">
                  {number}
                </div>
                <div className="heading-2 text-ink mb-3 font-primary font-bold">
                  {label}
                </div>
                <div className="text-focus font-body">
                  {sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding px-8" ref={testimonialsRef}>
        <div className="container-max">
          <div className={`text-center mb-24 animate-on-scroll ${testimonialsInView ? 'in-view' : ''}`}>
            <div className="caption text-accent-1 mb-6 tracking-extra-wide">Student Stories</div>
            <h2 className="display-2 font-black text-ink mb-8 font-primary">
              What Students{' '}
              <span className="text-gradient">Are Saying</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {testimonials.map(({ quote, author, role }, index) => (
              <div 
                key={author}
                className={`glass-card rounded-none p-10 animate-on-scroll stagger-${index + 1} ${testimonialsInView ? 'in-view' : ''}`}
                data-cursor-interactive
              >
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-accent-1 rounded-sm mr-1" />
                  ))}
                </div>
                <blockquote className="text-ink font-body text-lg leading-relaxed mb-8">
                  "{quote}"
                </blockquote>
                <div className="border-t border-focus pt-6">
                  <div className="font-bold text-ink font-primary mb-1">{author}</div>
                  <div className="text-focus text-sm font-body">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding px-8 relative bg-focus" ref={ctaRef}>
        <div className="container-max text-center">
          <div className={`animate-on-scroll ${ctaInView ? 'in-view' : ''}`}>
            <div className="caption text-accent-1 mb-8 tracking-extra-wide">Ready to Start?</div>
            <h2 className="display-1 font-black text-ink mb-8 font-primary leading-none">
              Join{' '}
              <span className="text-gradient">UseThis</span>
              <br />
              Today
            </h2>
            <div className="w-32 h-1 bg-accent-1 mx-auto mb-12" />
            <p className="body-large text-ink mb-16 max-w-4xl mx-auto font-body leading-relaxed">
              Start sharing, start saving, start building community. 
              Join thousands of students already using UseThis.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-8 justify-center animate-on-scroll stagger-1 ${ctaInView ? 'in-view' : ''}`}>
              <Link to="/login" data-cursor-interactive>
                <Button size="lg" className="flex items-center space-x-4 text-xl px-16 py-8">
                  <span>Get Started Free</span>
                  <ArrowRight size={24} />
                </Button>
              </Link>
              <button 
                data-cursor-interactive
                className="btn-ghost px-16 py-8 text-xl"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-muted">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-8 lg:mb-0">
              <div className="w-10 h-10 bg-accent-1 rounded-sm flex items-center justify-center">
                <span className="text-canvas font-black text-lg font-mono">U</span>
              </div>
              <div>
                <span className="text-xl font-black text-ink font-primary">UseThis</span>
                <div className="text-xs text-focus font-mono">© 2025</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <button className="text-focus hover:text-accent-1 transition-colors font-body link-hover" data-cursor-interactive>
                Privacy
              </button>
              <button className="text-focus hover:text-accent-1 transition-colors font-body link-hover" data-cursor-interactive>
                Terms
              </button>
              <button className="text-focus hover:text-accent-1 transition-colors font-body link-hover" data-cursor-interactive>
                Support
              </button>
            </div>
          </div>
          
          <div className="w-full h-px bg-muted mt-12 mb-8" />
          
          <div className="text-center">
            <p className="text-focus font-body text-sm">
              Built for students, by students. Empowering campus communities everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}