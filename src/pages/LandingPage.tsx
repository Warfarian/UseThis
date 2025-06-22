import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { InteractiveCursor } from '../components/InteractiveCursor'
import { Button } from '../components/ui/Button'
import { ArrowRight, Zap, Users, Shield, GraduationCap, Globe } from 'lucide-react'

export const LandingPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Intersection Observer hooks
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [visionRef, visionInView] = useInView({ threshold: 0.1, triggerOnce: true })
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3 sm:space-x-4 group" data-cursor-interactive>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary flex items-center justify-center relative overflow-hidden">
                <span className="text-pure-white font-black text-lg sm:text-xl font-mono">U</span>
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-pure-white font-display uppercase tracking-tight">UseThis</span>
                <div className="text-xs text-primary font-mono uppercase tracking-widest">BETA</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-6">
                <button className="nav-item-brutal text-sm" data-cursor-interactive>
                  ABOUT
                </button>
                <button className="nav-item-brutal text-sm" data-cursor-interactive>
                  FEATURES
                </button>
              </div>
              
              <Link to="/login" data-cursor-interactive>
                <Button size="sm" className="text-xs sm:text-sm px-3 sm:px-6">
                  ENTER
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6" ref={heroRef}>
        {/* Animated background elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 border-4 border-dashed border-steel opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px) rotate(45deg)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 border-4 border-primary opacity-30"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className={`mb-12 sm:mb-16 ${heroInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-8 sm:mb-12">
              <div className="flex items-center space-x-3 sm:space-x-4 px-4 sm:px-6 py-2 sm:py-3 border-2 border-primary bg-charcoal">
                <Zap className="text-primary" size={16} />
                <span className="text-primary font-mono text-xs sm:text-sm uppercase tracking-widest font-bold">
                  STUDENT ECONOMY PLATFORM
                </span>
              </div>
            </div>
            
            <h1 className="text-mega font-black text-pure-white mb-6 sm:mb-8 font-display">
              <span className="text-primary glitch" data-text="SHARE.">SHARE.</span>{' '}
              <span className="text-accent glitch" data-text="BORROW.">BORROW.</span>{' '}
              <br />
              <span className="text-secondary glitch" data-text="THRIVE.">THRIVE.</span>
            </h1>
            
            <div className="divider-brutal mb-8 sm:mb-12" />
            
            <p className={`text-lg sm:text-xl md:text-2xl text-concrete max-w-4xl mx-auto leading-tight font-display font-bold uppercase tracking-wide mb-12 sm:mb-16 ${heroInView ? 'animate-slide-brutal delay-200' : 'opacity-0'}`}>
              THE PEER-TO-PEER PLATFORM BUILT FOR STUDENTS. 
              <span className="text-primary"> SHARE RESOURCES</span>, 
              <span className="text-accent"> MAKE MONEY</span>, 
              <span className="text-secondary"> BUILD COMMUNITY</span>.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center mb-16 sm:mb-20 ${heroInView ? 'animate-bounce-hard delay-400' : 'opacity-0'}`}>
            <Link to="/login" data-cursor-interactive>
              <Button size="lg" className="flex items-center space-x-3 sm:space-x-4 text-lg sm:text-xl px-12 sm:px-16 py-6 sm:py-8 w-full sm:w-auto">
                <span>LAUNCH PLATFORM</span>
                <ArrowRight size={20} />
              </Button>
            </Link>
            <button 
              data-cursor-interactive
              className="btn-outline px-12 sm:px-16 py-6 sm:py-8 text-lg sm:text-xl w-full sm:w-auto"
            >
              WATCH DEMO
            </button>
          </div>

          {/* Metrics bar */}
          <div className={`flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 lg:space-x-16 ${heroInView ? 'animate-slide-brutal delay-500' : 'opacity-0'}`}>
            {stats.map(({ number, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary font-mono mb-2">{number}</div>
                <div className="text-steel text-xs sm:text-sm font-bold uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer Section */}
      <section className="py-16 sm:py-24 bg-pure-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="divider-brutal opacity-30" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative bg-charcoal" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 sm:mb-24 ${featuresInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div className="text-primary text-sm font-bold uppercase tracking-widest mb-6 font-mono">HOW IT WORKS</div>
            <h2 className="text-giant font-black text-pure-white mb-6 sm:mb-8 font-display">
              BUILT FOR{' '}
              <span className="text-accent">STUDENTS</span>
            </h2>
            <div className="divider-brutal mb-6 sm:mb-8" />
            <p className="text-lg sm:text-xl text-concrete font-display font-bold uppercase tracking-wide max-w-3xl mx-auto">
              EVERYTHING YOU NEED TO SHARE RESOURCES AND BUILD COMMUNITY.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map(({ icon: Icon, title, description, accent }, index) => (
              <div 
                key={title}
                className={`relative bg-pure-black border-4 border-steel p-6 sm:p-8 group transition-all duration-200 hover:border-${accent} hover:-translate-y-2 ${featuresInView ? `animate-bounce-hard delay-${(index + 1) * 100}` : 'opacity-0'}`}
                data-cursor-interactive
              >
                {/* Accent stripe */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-${accent} transition-all duration-200`} />
                
                {/* Icon section */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 border-4 border-steel flex items-center justify-center group-hover:border-${accent} transition-all duration-200 bg-charcoal`}>
                    <Icon size={24} className={`text-steel group-hover:text-${accent} transition-colors duration-200`} />
                  </div>
                  <div className={`text-4xl sm:text-6xl font-black text-steel/20 group-hover:text-${accent}/30 transition-colors duration-200 font-mono`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className={`text-xl sm:text-2xl font-black text-pure-white mb-3 sm:mb-4 font-display group-hover:text-${accent} transition-colors duration-200`}>
                  {title}
                </h3>
                
                <div className={`w-12 sm:w-16 h-1 bg-steel mb-4 sm:mb-6 group-hover:bg-${accent} group-hover:w-20 sm:group-hover:w-24 transition-all duration-200`} />
                
                <p className="text-concrete font-display font-medium text-sm leading-relaxed tracking-wide">
                  {description}
                </p>
                
                {/* Bottom accent */}
                <div className={`absolute bottom-0 right-0 w-6 sm:w-8 h-6 sm:h-8 bg-${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative bg-pure-black" ref={visionRef}>
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 sm:mb-16 ${visionInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div className="text-accent text-sm font-bold uppercase tracking-widest mb-6 font-mono">OUR VISION</div>
            <h2 className="text-giant font-black text-pure-white mb-6 sm:mb-8 font-display">
              THE{' '}
              <span className="text-primary">FUTURE</span>{' '}
              OF CAMPUS{' '}
              <span className="text-secondary">SHARING</span>
            </h2>
            <div className="divider-brutal mb-6 sm:mb-8" />
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center ${visionInView ? 'animate-slide-brutal delay-200' : 'opacity-0'}`}>
            {/* Left Column - Current Demo */}
            <div className="bg-charcoal border-4 border-steel p-6 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent flex items-center justify-center mr-3 sm:mr-4">
                  <Zap size={20} className="text-pure-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-pure-white font-display uppercase">
                  CURRENT: DEMO MODE
                </h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-concrete font-display font-medium leading-relaxed text-sm sm:text-base">
                <p>
                  <strong className="text-accent">What you're experiencing now:</strong> A fully functional demonstration of our peer-to-peer rental platform where students can share resources, build community, and earn money.
                </p>
                <p>
                  This demo showcases all core features including item listings, booking requests, messaging, reviews, and secure transactions - giving you a complete preview of the UseThis experience.
                </p>
              </div>
            </div>

            {/* Right Column - Future Vision */}
            <div className="bg-charcoal border-4 border-primary p-6 sm:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary flex items-center justify-center mr-3 sm:mr-4">
                  <GraduationCap size={20} className="text-pure-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-pure-white font-display uppercase">
                  FUTURE: CAMPUS-SPECIFIC
                </h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-concrete font-display font-medium leading-relaxed text-sm sm:text-base">
                <p>
                  <strong className="text-primary">Our ultimate vision:</strong> University-specific instances where students can only sign up using their official .edu email addresses, creating trusted campus communities.
                </p>
                <p>
                  Each university will have its own dedicated UseThis platform, ensuring all transactions happen within verified student networks for maximum safety and relevance.
                </p>
                <div className="flex items-center mt-4 sm:mt-6 p-3 sm:p-4 bg-primary/20 border-l-4 border-primary">
                  <Globe size={16} className="text-primary mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-primary font-display font-bold uppercase text-xs sm:text-sm">
                    INTER-UNIVERSITY TRADING UNDER CONSIDERATION
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={`text-center mt-12 sm:mt-16 ${visionInView ? 'animate-bounce-hard delay-400' : 'opacity-0'}`}>
            <div className="bg-steel/10 border-2 border-steel p-6 sm:p-8 max-w-4xl mx-auto">
              <h4 className="text-lg sm:text-xl font-black text-pure-white mb-3 sm:mb-4 font-display uppercase">
                BE PART OF THE REVOLUTION
              </h4>
              <p className="text-steel font-display font-bold uppercase tracking-wide mb-4 sm:mb-6 text-sm sm:text-base">
                Experience the demo today and help shape the future of campus resource sharing
              </p>
              <Link to="/login" data-cursor-interactive>
                <Button className="flex items-center space-x-2 mx-auto">
                  <span>TRY THE DEMO</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Zelda Reference */}
      <section className="py-12 sm:py-16 lg:py-32 px-4 sm:px-6 bg-charcoal" ref={ctaRef}>
        <div className="max-w-5xl mx-auto text-center">
          <div className={`${ctaInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div className="text-accent text-sm font-bold uppercase tracking-widest mb-6 sm:mb-8 font-mono">DON'T FACE STUDENT LIFE ALONE</div>
            <h2 className="text-giant font-black text-pure-white mb-3 sm:mb-4 font-display leading-none">
              IT'S DANGEROUS TO{' '}
              <span className="text-crimson">GO ALONE!</span>
            </h2>
            <h2 className="text-giant font-black text-primary mb-6 sm:mb-8 font-display leading-none glitch" data-text="USETHIS">
              <span className="text-primary">USETHIS</span>
            </h2>
            <div className="divider-brutal mb-8 sm:mb-12" />
            <p className="text-lg sm:text-xl text-concrete mb-12 sm:mb-16 max-w-4xl mx-auto font-display font-bold uppercase tracking-wide leading-tight">
              SHARE RESOURCES. SAVE MONEY. BUILD COMMUNITY. 
              JOIN THOUSANDS OF STUDENTS ALREADY USING USETHIS.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center ${ctaInView ? 'animate-bounce-hard delay-200' : 'opacity-0'}`}>
              <Link to="/login" data-cursor-interactive>
                <Button size="lg" className="flex items-center space-x-3 sm:space-x-4 text-lg sm:text-xl px-12 sm:px-16 py-6 sm:py-8 w-full sm:w-auto">
                  <span>GET STARTED FREE</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <button 
                data-cursor-interactive
                className="btn-ghost px-12 sm:px-16 py-6 sm:py-8 text-lg sm:text-xl w-full sm:w-auto"
              >
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 sm:py-20 px-4 sm:px-6 border-t-4 border-primary bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8 lg:mb-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary flex items-center justify-center">
                <span className="text-pure-white font-black text-base sm:text-lg font-mono">U</span>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black text-pure-white font-display uppercase">UseThis</span>
                <div className="text-xs text-steel font-mono">© 2025</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 sm:space-x-8">
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

      {/* Bolt Logo - Bottom Right */}
      <a 
        href="https://bolt.new/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 w-16 h-16 z-50 opacity-80 hover:opacity-100 transition-opacity duration-300"
        data-cursor-interactive
      >
        <img 
          src="/black_circle_360x360.png" 
          alt="Powered by Bolt" 
          className="w-full h-full"
        />
      </a>
    </div>
  )
}