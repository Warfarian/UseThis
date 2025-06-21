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
      title: "Peer-to-Peer Network",
      description: "Connect directly with verified students in your campus community through our secure platform."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Advanced verification system with comprehensive ratings and reviews for complete peace of mind."
    },
    {
      icon: Zap,
      title: "Instant Discovery",
      description: "AI-powered search and recommendation engine finds exactly what you need in seconds."
    }
  ]

  const stats = [
    { number: "50K+", label: "Active Students", sublabel: "Across 200+ Universities" },
    { number: "1M+", label: "Items Shared", sublabel: "Worth $50M+ in Value" },
    { number: "99.8%", label: "Trust Score", sublabel: "Verified Transactions" }
  ]

  const testimonials = [
    {
      quote: "UseThis transformed how I approach college expenses. I've saved thousands while building genuine connections.",
      author: "Sarah Chen",
      role: "Stanford University, Computer Science",
      rating: 5
    },
    {
      quote: "The platform's design is incredible. It feels like the future of student collaboration.",
      author: "Marcus Johnson",
      role: "MIT, Engineering",
      rating: 5
    },
    {
      quote: "Finally, a platform that understands student needs. Clean, fast, and incredibly intuitive.",
      author: "Elena Rodriguez",
      role: "Harvard, Business",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-pure-black geometric-grid overflow-hidden">
      <InteractiveCursor />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="container-max px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4" data-cursor-interactive>
              <div className="w-12 h-12 bg-cyan rounded-sm flex items-center justify-center">
                <span className="text-pure-black font-black text-xl font-mono">U</span>
              </div>
              <div>
                <span className="text-2xl font-black text-pure-white font-primary tracking-tightest">UseThis</span>
                <div className="text-xs text-gray-400 font-mono uppercase tracking-extra-wide">Beta</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-gray-300 hover:text-cyan transition-colors font-body font-medium link-hover" data-cursor-interactive>
                About
              </button>
              <button className="text-gray-300 hover:text-cyan transition-colors font-body font-medium link-hover" data-cursor-interactive>
                Features
              </button>
              <Link to="/login" data-cursor-interactive>
                <Button size="sm" className="magnetic">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 floating-shapes" ref={heroRef}>
        {/* Animated background elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-dashed border-gray-800 rounded-full floating-element opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 border-solid-thick rounded-sm floating-element-delayed opacity-20"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px) rotate(45deg)`
          }}
        />

        <div className="container-max text-center relative z-10">
          <div className={`mb-16 ${heroInView ? 'hero-text' : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-4 px-6 py-3 border border-gray-700 rounded-full">
                <Sparkles className="text-cyan" size={20} />
                <span className="text-gray-300 font-mono caption">
                  The Future of Student Economy
                </span>
              </div>
            </div>
            
            <h1 className="display-1 font-black text-pure-white mb-8 font-primary tracking-tightest">
              SHARE.{' '}
              <span className="text-gradient italic">BORROW.</span>{' '}
              <br />
              <span className="text-cyan">THRIVE.</span>
            </h1>
            
            <div className={`divider-thick w-24 mx-auto mb-12 ${heroInView ? 'hero-text-delay-1' : 'opacity-0'}`} />
            
            <p className={`body-large text-gray-300 max-w-4xl mx-auto leading-relaxed font-body mb-16 ${heroInView ? 'hero-text-delay-1' : 'opacity-0'}`}>
              The revolutionary peer-to-peer platform transforming how students 
              <span className="text-cyan font-semibold"> share resources</span>, 
              <span className="text-cyan font-semibold"> build wealth</span>, and 
              <span className="text-cyan font-semibold"> create community</span>.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 ${heroInView ? 'hero-text-delay-2' : 'opacity-0'}`}>
            <Link to="/login" data-cursor-interactive>
              <Button size="lg" className="magnetic flex items-center space-x-4 text-lg px-12 py-6">
                <span>Launch Platform</span>
                <ArrowRight size={20} />
              </Button>
            </Link>
            <button 
              data-cursor-interactive
              className="btn-secondary px-12 py-6 text-lg magnetic"
            >
              Watch Demo
            </button>
          </div>

          {/* Metrics bar */}
          <div className={`flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 ${heroInView ? 'hero-text-delay-3' : 'opacity-0'}`}>
            <div className="text-center">
              <div className="text-4xl font-black text-cyan font-mono mb-2">50K+</div>
              <div className="text-gray-400 caption">Active Users</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-700" />
            <div className="text-center">
              <div className="text-4xl font-black text-cyan font-mono mb-2">$50M+</div>
              <div className="text-gray-400 caption">Value Shared</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-700" />
            <div className="text-center">
              <div className="text-4xl font-black text-cyan font-mono mb-2">200+</div>
              <div className="text-gray-400 caption">Universities</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-12 border-2 border-gray-700 rounded-full flex justify-center">
            <div className="w-1 h-4 bg-cyan rounded-full mt-2 pulse-indicator" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding px-8 relative" ref={featuresRef}>
        <div className="container-max">
          <div className={`text-center mb-24 animate-on-scroll ${featuresInView ? 'in-view' : ''}`}>
            <div className="caption text-cyan mb-6 tracking-extra-wide">PLATFORM FEATURES</div>
            <h2 className="display-2 font-black text-pure-white mb-8 font-primary">
              Built for the{' '}
              <span className="text-gradient-reverse italic">Modern Student</span>
            </h2>
            <div className="divider w-32 mx-auto mb-8" />
            <p className="body-large text-gray-400 font-body max-w-3xl mx-auto">
              Every feature designed with student needs in mind. Experience the future of campus collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div 
                key={title}
                className={`glass-card rounded-none p-12 text-center group animate-on-scroll stagger-${index + 1} ${featuresInView ? 'in-view' : ''}`}
                data-cursor-interactive
              >
                <div className="w-20 h-20 mx-auto mb-8 border-2 border-gray-700 rounded-sm flex items-center justify-center group-hover:border-cyan transition-all duration-500">
                  <Icon size={36} className="text-gray-400 group-hover:text-cyan transition-colors duration-500" />
                </div>
                <h3 className="heading-2 font-bold text-pure-white mb-6 font-primary group-hover:text-cyan transition-colors duration-300">
                  {title}
                </h3>
                <div className="divider w-16 mx-auto mb-6 group-hover:bg-cyan transition-colors duration-300" />
                <p className="text-gray-400 font-body leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding px-8 bg-dark-charcoal" ref={statsRef}>
        <div className="container-max">
          <div className={`text-center mb-20 animate-on-scroll ${statsInView ? 'in-view' : ''}`}>
            <div className="caption text-cyan mb-6 tracking-extra-wide">PLATFORM METRICS</div>
            <h2 className="display-2 font-black text-pure-white mb-8 font-primary">
              Trusted by{' '}
              <span className="text-gradient italic">Thousands</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {stats.map(({ number, label, sublabel }, index) => (
              <div 
                key={label}
                className={`text-center animate-on-scroll-scale stagger-${index + 1} ${statsInView ? 'in-view' : ''}`}
              >
                <div className="display-1 font-black text-cyan mb-4 font-mono">
                  {number}
                </div>
                <div className="heading-2 text-pure-white mb-3 font-primary font-bold">
                  {label}
                </div>
                <div className="text-gray-400 font-body">
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
            <div className="caption text-cyan mb-6 tracking-extra-wide">STUDENT VOICES</div>
            <h2 className="display-2 font-black text-pure-white mb-8 font-primary">
              What Students{' '}
              <span className="text-gradient-reverse italic">Are Saying</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {testimonials.map(({ quote, author, role, rating }, index) => (
              <div 
                key={author}
                className={`glass-card rounded-none p-10 animate-on-scroll stagger-${index + 1} ${testimonialsInView ? 'in-view' : ''}`}
                data-cursor-interactive
              >
                <div className="flex mb-6">
                  {[...Array(rating)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-cyan rounded-sm mr-1" />
                  ))}
                </div>
                <blockquote className="text-gray-300 font-body text-lg leading-relaxed mb-8 italic">
                  "{quote}"
                </blockquote>
                <div className="border-t border-gray-700 pt-6">
                  <div className="font-bold text-pure-white font-primary mb-1">{author}</div>
                  <div className="text-gray-400 text-sm font-body">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding px-8 relative bg-gunmetal" ref={ctaRef}>
        <div className="container-max text-center">
          <div className={`animate-on-scroll ${ctaInView ? 'in-view' : ''}`}>
            <div className="caption text-cyan mb-8 tracking-extra-wide">JOIN THE REVOLUTION</div>
            <h2 className="display-1 font-black text-pure-white mb-8 font-primary leading-none tracking-tightest">
              Ready to{' '}
              <span className="text-gradient italic">Transform</span>
              <br />
              Your Campus?
            </h2>
            <div className="divider-thick w-32 mx-auto mb-12" />
            <p className="body-large text-gray-300 mb-16 max-w-4xl mx-auto font-body leading-relaxed">
              Join the revolution. Share what you have, discover what you need, 
              and build lasting connections with your community.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-8 justify-center animate-on-scroll stagger-1 ${ctaInView ? 'in-view' : ''}`}>
              <Link to="/login" data-cursor-interactive>
                <Button size="lg" className="magnetic flex items-center space-x-4 text-xl px-16 py-8">
                  <span>Launch Platform</span>
                  <ArrowRight size={24} />
                </Button>
              </Link>
              <button 
                data-cursor-interactive
                className="btn-ghost px-16 py-8 text-xl magnetic"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-gray-800">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-8 lg:mb-0">
              <div className="w-10 h-10 bg-cyan rounded-sm flex items-center justify-center">
                <span className="text-pure-black font-black text-lg font-mono">U</span>
              </div>
              <div>
                <span className="text-xl font-black text-pure-white font-primary">UseThis</span>
                <div className="text-xs text-gray-500 font-mono">© 2025</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <button className="text-gray-400 hover:text-cyan transition-colors font-body link-hover" data-cursor-interactive>
                Privacy
              </button>
              <button className="text-gray-400 hover:text-cyan transition-colors font-body link-hover" data-cursor-interactive>
                Terms
              </button>
              <button className="text-gray-400 hover:text-cyan transition-colors font-body link-hover" data-cursor-interactive>
                Support
              </button>
            </div>
          </div>
          
          <div className="divider mt-12 mb-8" />
          
          <div className="text-center">
            <p className="text-gray-500 font-body text-sm">
              Built with ❤️ for students, by students. Empowering the next generation of collaborative economy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}