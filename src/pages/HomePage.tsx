import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { supabase, Item } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatPrice } from '../lib/utils'
import { Search, Plus, TrendingUp, Zap, Gamepad2, ChefHat, ArrowRight } from 'lucide-react'

export const HomePage: React.FC = () => {
  const [mode, setMode] = useState<'need' | 'have'>('need')
  const [featuredItems, setFeaturedItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  // Intersection Observer hooks for animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [categoriesRef, categoriesInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [featuredRef, featuredInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    fetchFeaturedItems()
  }, [])

  const fetchFeaturedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          owner:users(name, rating)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setFeaturedItems(data || [])
    } catch (error) {
      console.error('Error fetching featured items:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { name: 'ELECTRONICS', icon: Zap, color: 'primary' },
    { name: 'GAMING', icon: Gamepad2, color: 'accent' },
    { name: 'KITCHEN', icon: ChefHat, color: 'secondary' },
  ]

  return (
    <div className="min-h-screen bg-pure-black noise pt-16 sm:pt-20">
      {/* Hero Section - Responsive */}
      <section className="relative py-12 sm:py-16 lg:py-32 px-4 sm:px-6 overflow-hidden" ref={heroRef}>
        <div className="max-w-7xl mx-auto text-center">
          <div className={`mb-8 sm:mb-12 ${heroInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-giant font-black text-pure-white mb-6 sm:mb-8 font-display leading-none">
              <span className="text-primary glitch" data-text="SHARE.">SHARE.</span>{' '}
              <span className="text-accent glitch" data-text="BORROW.">BORROW.</span>{' '}
              <br />
              <span className="text-secondary glitch" data-text="THRIVE.">THRIVE.</span>
            </h1>
            
            <div className="divider-brutal mb-8 sm:mb-12" />
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-concrete max-w-4xl mx-auto leading-tight font-display font-bold uppercase tracking-wide mb-12 sm:mb-16">
              THE PEER-TO-PEER PLATFORM BUILT FOR STUDENTS. 
              <span className="text-primary"> SHARE RESOURCES</span>, 
              <span className="text-accent"> MAKE MONEY</span>, 
              <span className="text-secondary"> BUILD COMMUNITY</span>.
            </p>
          </div>

          {/* Mode Toggle - Responsive */}
          <div className={`mb-12 sm:mb-16 ${heroInView ? 'animate-bounce-hard delay-200' : 'opacity-0'}`}>
            <div className="inline-flex glass-brutal p-1 sm:p-2 border-2 border-steel">
              <button
                onClick={() => setMode('need')}
                data-cursor-interactive="true"
                className={`px-3 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 font-bold font-display text-xs sm:text-sm uppercase tracking-wide transition-all duration-100 ${
                  mode === 'need'
                    ? 'bg-primary text-pure-white'
                    : 'text-pure-white hover:text-primary'
                }`}
              >
                I NEED SOMETHING
              </button>
              <button
                onClick={() => setMode('have')}
                data-cursor-interactive="true"
                className={`px-3 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 font-bold font-display text-xs sm:text-sm uppercase tracking-wide transition-all duration-100 ${
                  mode === 'have'
                    ? 'bg-primary text-pure-white'
                    : 'text-pure-white hover:text-primary'
                }`}
              >
                I HAVE SOMETHING
              </button>
            </div>
          </div>

          {/* Action Buttons - Responsive */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 sm:mb-20 ${heroInView ? 'animate-bounce-hard delay-400' : 'opacity-0'}`}>
            {mode === 'need' ? (
              <>
                <Link to="/browse" data-cursor-interactive="true" className="w-full sm:w-auto">
                  <Button size="lg" className="flex items-center justify-center space-x-3 w-full text-sm sm:text-base px-8 sm:px-12 lg:px-16">
                    <Search size={18} />
                    <span>BROWSE ITEMS</span>
                    <ArrowRight size={14} />
                  </Button>
                </Link>
                <Link to="/login" data-cursor-interactive="true" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-sm sm:text-base px-8 sm:px-12 lg:px-16">
                    JOIN THE COMMUNITY
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/add-listing" data-cursor-interactive="true" className="w-full sm:w-auto">
                  <Button size="lg" className="flex items-center justify-center space-x-3 w-full text-sm sm:text-base px-8 sm:px-12 lg:px-16">
                    <Plus size={18} />
                    <span>LIST YOUR ITEM</span>
                    <ArrowRight size={14} />
                  </Button>
                </Link>
                <Link to="/profile" data-cursor-interactive="true" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-sm sm:text-base px-8 sm:px-12 lg:px-16">
                    MANAGE LISTINGS
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Abstract Background Elements - Responsive */}
        <div className="absolute top-1/4 left-4 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-primary opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-4 sm:right-10 w-24 h-24 sm:w-48 sm:h-48 bg-accent opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-12 h-12 sm:w-24 sm:h-24 bg-secondary opacity-10 blur-2xl" />
      </section>

      {/* Popular Categories - Responsive */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-charcoal" ref={categoriesRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 sm:mb-16 ${categoriesInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-huge font-black text-pure-white mb-4 sm:mb-6 font-display">
              POPULAR CATEGORIES
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-concrete font-display font-bold uppercase tracking-wide">
              WHAT STUDENTS ARE SHARING MOST
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map(({ name, icon: Icon, color }, index) => (
              <Link key={name} to={`/browse?category=${encodeURIComponent(name)}`}>
                <Card className={`text-center group p-6 sm:p-8 ${categoriesInView ? `animate-bounce-hard delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 glass-brutal flex items-center justify-center border-2 border-steel group-hover:border-primary transition-all duration-100">
                    <Icon size={28} className="text-steel group-hover:text-primary transition-colors duration-100" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-big font-black text-pure-white mb-2 sm:mb-3 font-display group-hover:text-primary transition-colors duration-100">{name}</h3>
                  <p className="text-steel font-display font-bold uppercase tracking-wide text-xs sm:text-sm">DISCOVER AVAILABLE ITEMS</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items - Responsive */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6" ref={featuredRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 sm:mb-16 ${featuredInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-huge font-black text-pure-white mb-4 sm:mb-6 font-display flex flex-col lg:flex-row lg:items-center">
                <TrendingUp className="mb-2 lg:mb-0 lg:mr-6 text-primary" size={32} />
                TRENDING NOW
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-concrete font-display font-bold uppercase tracking-wide">
                ITEMS THAT ARE IN HIGH DEMAND
              </p>
            </div>
            <Link to="/browse" data-cursor-interactive="true">
              <Button variant="outline" className="flex items-center space-x-2 w-full lg:w-auto">
                <span>VIEW ALL</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="loading-brutal h-64 sm:h-80">
                  <></>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredItems.map((item, index) => (
                <Link key={item.id} to={`/item/${item.id}`}>
                  <Card className={`group p-4 sm:p-6 ${featuredInView ? `animate-bounce-hard delay-${(index % 3 + 1) * 100}` : 'opacity-0'}`}>
                    <div className="aspect-video bg-steel/20 mb-4 sm:mb-6 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-steel font-display font-bold uppercase tracking-wide text-xs sm:text-sm">NO IMAGE</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-pure-white mb-2 sm:mb-3 font-display group-hover:text-primary transition-colors duration-100 uppercase">
                      {item.title}
                    </h3>
                    <p className="text-steel text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 font-display font-bold uppercase tracking-wide">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-black text-base sm:text-lg font-mono">
                        {formatPrice(item.price_per_day)}/DAY
                      </span>
                      <span className="text-steel text-xs sm:text-sm font-display font-bold uppercase tracking-wide">
                        {item.location}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="py-12 sm:py-16 lg:py-32 px-4 sm:px-6 bg-charcoal" ref={ctaRef}>
        <div className="max-w-5xl mx-auto text-center">
          <div className={`${ctaInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-giant font-black text-pure-white mb-6 sm:mb-8 font-display leading-none">
              READY TO{' '}
              <span className="text-primary glitch" data-text="USETHIS">USETHIS</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-concrete mb-8 sm:mb-12 max-w-3xl mx-auto font-display font-bold uppercase tracking-wide leading-tight">
              JOIN THOUSANDS OF STUDENTS ALREADY SHARING, SAVING, AND BUILDING COMMUNITY THROUGH PEER-TO-PEER RENTALS.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center ${ctaInView ? 'animate-bounce-hard delay-200' : 'opacity-0'}`}>
              <Link to="/login" data-cursor-interactive="true" className="w-full sm:w-auto">
                <Button size="lg" className="flex items-center justify-center space-x-3 w-full text-sm sm:text-base px-8 sm:px-12 lg:px-16">
                  <span>GET STARTED</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/browse" data-cursor-interactive="true" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-sm sm:text-base px-8 sm:px-12 lg:px-16">
                  EXPLORE ITEMS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}