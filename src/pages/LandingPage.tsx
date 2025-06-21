import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { InteractiveCursor } from '../components/InteractiveCursor'
import { Button } from '../components/ui/Button'
import { ArrowRight, Zap, Users, Shield } from 'lucide-react'

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
      title: "STUDENT NETWORK",
      description: "Connect with verified students across 200+ universities. Share resources. Build lasting community connections.",
      accent: "primary"
    },
    {
      icon: Shield,
      title: "SECURE PLATFORM",
      description: "Built-in verification system. Comprehensive ratings. Safe transactions. Your security is our priority.",
      accent: "accent"
    },
    {
      icon: Zap,
      title: "INSTANT ACCESS",
      description: "Find what you need in seconds. Book instantly. Get results fast. No waiting, no hassle.",
      accent: "secondary"
    }
  ]

  const stats = [
    { number: "50K+", label: "STUDENTS" },
    { number: "200+", label: "UNIVERSITIES" },
    { number: "$2M+", label: "SAVED" }
  ]

  return (
    <div className="min-h-screen bg-pure-black noise overflow-hidden">
      <InteractiveCursor />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4 group" data-cursor-interactive>
              <div className="w-12 h-12 bg-primary flex items-center justify-center relative overflow-hidden">
                <span className="text-pure-white font-black text-xl font-mono">U</span>
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
              </div>
              <div>
                <span className="text-2xl font-black text-pure-white font-display uppercase tracking-tight">UseThis</span>
                <div className="text-xs text-primary font-mono uppercase tracking-widest">BETA</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="nav-item-brutal text-sm" data-cursor-interactive>
                ABOUT
              </button>
              <button className="nav-item-brutal text-sm" data-cursor-interactive>
                FEATURES
              </button>
              <Link to="/login" data-cursor-interactive>
                <Button size="sm">
                  ENTER
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6" ref={heroRef}>
        {/* Animated background elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 border-4 border-dashed border-steel opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px) rotate(45deg)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 border-4 border-primary opacity-30"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className={`mb-16 ${heroInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-4 px-6 py-3 border-2 border-primary bg-charcoal">
                <Zap className="text-primary" size={20} />
                <span className="text-primary font-mono text-sm uppercase tracking-widest font-bold">
                  STUDENT ECONOMY PLATFORM
                </span>
              </div>
            </div>
            
            <h1 className="text-mega font-black text-pure-white mb-8 font-display glitch" data-text="SHARE. BORROW. THRIVE.">
              <span className="text-primary">SHARE.</span>{' '}
              <span className="text-accent">BORROW.</span>{' '}
              <br />
              <span className="text-secondary">THRIVE.</span>
            </h1>
            
            <div className="divider-brutal mb-12" />
            
            <p className={`text-xl md:text-2xl text-concrete max-w-4xl mx-auto leading-tight font-display font-bold uppercase tracking-wide mb-16 ${heroInView ? 'animate-slide-brutal delay-200' : 'opacity-0'}`}>
              THE PEER-TO-PEER PLATFORM BUILT FOR STUDENTS. 
              <span className="text-primary"> SHARE RESOURCES</span>, 
              <span className="text-accent"> MAKE MONEY</span>, 
              <span className="text-secondary"> BUILD COMMUNITY</span>.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 ${heroInView ? 'animate-bounce-hard delay-400' : 'opacity-0'}`}>
            <Link to="/login" data-cursor-interactive>
              <Button size="lg" className="flex items-center space-x-4 text-xl px-16 py-8">
                <span>LAUNCH PLATFORM</span>
                <ArrowRight size={24} />
              </Button>
            </Link>
            <button 
              data-cursor-interactive
              className="btn-outline px-16 py-8 text-xl"
            >
              WATCH DEMO
            </button>
          </div>

          {/* Metrics bar */}
          <div className={`flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 ${heroInView ? 'animate-slide-brutal delay-500' : 'opacity-0'}`}>
            {stats.map(({ number, label }, index) => (
              <div key={label} className="text-center">
                <div className="text-6xl font-black text-primary font-mono mb-2">{number}</div>
                <div className="text-steel text-sm font-bold uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer Section */}
      <section className="py-24 bg-pure-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="divider-brutal opacity-30" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative bg-charcoal" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-24 ${featuresInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div className="text-primary text-sm font-bold uppercase tracking-widest mb-6 font-mono">HOW IT WORKS</div>
            <h2 className="text-giant font-black text-pure-white mb-8 font-display">
              BUILT FOR{' '}
              <span className="text-accent">STUDENTS</span>
            </h2>
            <div className="divider-brutal mb-8" />
            <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide max-w-3xl mx-auto">
              EVERYTHING YOU NEED TO SHARE RESOURCES AND BUILD COMMUNITY.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description, accent }, index) => (
              <div 
                key={title}
                className={`relative bg-pure-black border-4 border-steel p-8 group transition-all duration-200 hover:border-${accent} hover:-translate-y-2 ${featuresInView ? `animate-bounce-hard delay-${(index + 1) * 100}` : 'opacity-0'}`}
                data-cursor-interactive
              >
                {/* Accent stripe */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-${accent} transition-all duration-200`} />
                
                {/* Icon section */}
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-16 h-16 border-4 border-steel flex items-center justify-center group-hover:border-${accent} transition-all duration-200 bg-charcoal`}>
                    <Icon size={32} className={`text-steel group-hover:text-${accent} transition-colors duration-200`} />
                  </div>
                  <div className={`text-6xl font-black text-steel/20 group-hover:text-${accent}/30 transition-colors duration-200 font-mono`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className={`text-2xl font-black text-pure-white mb-4 font-display group-hover:text-${accent} transition-colors duration-200`}>
                  {title}
                </h3>
                
                <div className={`w-16 h-1 bg-steel mb-6 group-hover:bg-${accent} group-hover:w-24 transition-all duration-200`} />
                
                <p className="text-concrete font-display font-medium text-sm leading-relaxed tracking-wide">
                  {description}
                </p>
                
                {/* Bottom accent */}
                <div className={`absolute bottom-0 right-0 w-8 h-8 bg-${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative bg-pure-black" ref={ctaRef}>
        <div className="max-w-5xl mx-auto text-center">
          <div className={`${ctaInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div className="text-primary text-sm font-bold uppercase tracking-widest mb-8 font-mono">READY TO START?</div>
            <h2 className="text-giant font-black text-pure-white mb-8 font-display leading-none">
              JOIN{' '}
              <span className="text-primary glitch" data-text="USETHIS">USETHIS</span>
              <br />
              <span className="text-accent">TODAY</span>
            </h2>
            <div className="divider-brutal mb-12" />
            <p className="text-xl text-concrete mb-16 max-w-4xl mx-auto font-display font-bold uppercase tracking-wide leading-tight">
              START SHARING. START SAVING. START BUILDING COMMUNITY. 
              JOIN THOUSANDS OF STUDENTS ALREADY USING USETHIS.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-8 justify-center ${ctaInView ? 'animate-bounce-hard delay-200' : 'opacity-0'}`}>
              <Link to="/login" data-cursor-interactive>
                <Button size="lg" className="flex items-center space-x-4 text-xl px-16 py-8">
                  <span>GET STARTED FREE</span>
                  <ArrowRight size={24} />
                </Button>
              </Link>
              <button 
                data-cursor-interactive
                className="btn-ghost px-16 py-8 text-xl"
              >
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t-4 border-primary bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-8 lg:mb-0">
              <div className="w-10 h-10 bg-primary flex items-center justify-center">
                <span className="text-pure-white font-black text-lg font-mono">U</span>
              </div>
              <div>
                <span className="text-xl font-black text-pure-white font-display uppercase">UseThis</span>
                <div className="text-xs text-steel font-mono">© 2025</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <button className="nav-item-brutal text-sm" data-cursor-interactive>
                PRIVACY
              </button>
              <button className="nav-item-brutal text-sm" data-cursor-interactive>
                TERMS
              </button>
              <button className="nav-item-brutal text-sm" data-cursor-interactive>
                SUPPORT
              </button>
            </div>
          </div>
          
          <div className="divider-brutal" />
          
          <div className="text-center">
            <p className="text-steel font-display font-bold uppercase tracking-wide text-sm">
              BUILT FOR STUDENTS, BY STUDENTS. EMPOWERING CAMPUS COMMUNITIES EVERYWHERE.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}