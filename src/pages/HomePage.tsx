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
    { name: 'ELECTRONICS', icon: Zap, color: 'electric' },
    { name: 'GAMING', icon: Gamepad2, color: 'hot-pink' },
    { name: 'KITCHEN', icon: ChefHat, color: 'neon-blue' },
  ]

  return (
    <div className="min-h-screen bg-pure-black noise">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden" ref={heroRef}>
        <div className="max-w-7xl mx-auto text-center">
          <div className={`mb-12 ${heroInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <h1 className="text-giant font-black text-pure-white mb-8 font-display leading-none">
              <span className="neon-electric">SHARE.</span>{' '}
              <span className="neon-pink">BORROW.</span>{' '}
              <br />
              <span className="neon-blue">THRIVE.</span>
            </h1>
            <p className="text-xl md:text-2xl text-concrete max-w-4xl mx-auto leading-tight font-display font-bold uppercase tracking-wide">
              THE PEER-TO-PEER RENTAL PLATFORM BUILT FOR COLLEGE STUDENTS. 
              TURN YOUR UNUSED ITEMS INTO INCOME, OR FIND EXACTLY WHAT YOU NEED.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className={`mb-16 ${heroInView ? 'animate-bounce-hard delay-200' : 'opacity-0'}`}>
            <div className="inline-flex glass-brutal p-2 border-2 border-steel">
              <button
                onClick={() => setMode('need')}
                data-cursor-interactive="true"
                className={`px-8 py-4 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 ${
                  mode === 'need'
                    ? 'bg-electric text-pure-black'
                    : 'text-pure-white hover:text-electric'
                }`}
              >
                I NEED SOMETHING
              </button>
              <button
                onClick={() => setMode('have')}
                data-cursor-interactive="true"
                className={`px-8 py-4 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 ${
                  mode === 'have'
                    ? 'bg-electric text-pure-black'
                    : 'text-pure-white hover:text-electric'
                }`}
              >
                I HAVE SOMETHING
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 ${heroInView ? 'animate-bounce-hard delay-400' : 'opacity-0'}`}>
            {mode === 'need' ? (
              <>
                <Link to="/browse" data-cursor-interactive="true">
                  <Button size="lg" className="flex items-center space-x-3">
                    <Search size={20} />
                    <span>BROWSE ITEMS</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/login" data-cursor-interactive="true">
                  <Button variant="outline" size="lg">
                    JOIN THE COMMUNITY
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/add-listing" data-cursor-interactive="true">
                  <Button size="lg" className="flex items-center space-x-3">
                    <Plus size={20} />
                    <span>LIST YOUR ITEM</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/profile" data-cursor-interactive="true">
                  <Button variant="outline" size="lg">
                    MANAGE LISTINGS
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-electric opacity-10 blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-hot-pink opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-neon-blue opacity-10 blur-2xl" />
      </section>

      {/* Popular Categories */}
      <section className="py-24 px-6 bg-charcoal" ref={categoriesRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 ${categoriesInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <h2 className="text-huge font-black text-pure-white mb-6 font-display">
              POPULAR CATEGORIES
            </h2>
            <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
              WHAT STUDENTS ARE SHARING MOST
            </p>
          </div>

          <div className="grid-brutal">
            {categories.map(({ name, icon: Icon, color }, index) => (
              <Link key={name} to={`/browse?category=${encodeURIComponent(name)}`}>
                <Card className={`text-center group ${categoriesInView ? `animate-bounce-hard delay-${(index + 1) * 100}` : 'opacity-0'}`}>
                  <div className="w-20 h-20 mx-auto mb-6 glass-brutal flex items-center justify-center border-2 border-steel group-hover:border-electric transition-all duration-100">
                    <Icon size={36} className="text-steel group-hover:text-electric transition-colors duration-100" />
                  </div>
                  <h3 className="text-big font-black text-pure-white mb-3 font-display group-hover:text-electric transition-colors duration-100">{name}</h3>
                  <p className="text-steel font-display font-bold uppercase tracking-wide text-sm">DISCOVER AVAILABLE ITEMS</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-24 px-6" ref={featuredRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between mb-16 ${featuredInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <div>
              <h2 className="text-huge font-black text-pure-white mb-6 font-display flex items-center">
                <TrendingUp className="mr-6 text-electric" size={48} />
                TRENDING NOW
              </h2>
              <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
                ITEMS THAT ARE IN HIGH DEMAND
              </p>
            </div>
            <Link to="/browse" data-cursor-interactive="true">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>VIEW ALL</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid-brutal">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="loading-brutal h-80" />
              ))}
            </div>
          ) : (
            <div className="grid-brutal">
              {featuredItems.map((item, index) => (
                <Link key={item.id} to={`/item/${item.id}`}>
                  <Card className={`group ${featuredInView ? `animate-bounce-hard delay-${(index % 3 + 1) * 100}` : 'opacity-0'}`}>
                    <div className="aspect-video bg-steel/20 mb-6 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">NO IMAGE</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-pure-white mb-3 font-display group-hover:text-electric transition-colors duration-100 uppercase">
                      {item.title}
                    </h3>
                    <p className="text-steel text-sm mb-4 line-clamp-2 font-display font-bold uppercase tracking-wide">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-electric font-black text-lg font-mono">
                        {formatPrice(item.price_per_day)}/DAY
                      </span>
                      <span className="text-steel text-sm font-display font-bold uppercase tracking-wide">
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

      {/* CTA Section */}
      <section className="py-32 px-6 bg-charcoal" ref={ctaRef}>
        <div className="max-w-5xl mx-auto text-center">
          <div className={`${ctaInView ? 'animate-slide-brutal' : 'opacity-0'}`}>
            <h2 className="text-giant font-black text-pure-white mb-8 font-display leading-none">
              READY TO{' '}
              <span className="neon-electric glitch" data-text="USETHIS">USETHIS</span>?
            </h2>
            <p className="text-xl text-concrete mb-12 max-w-3xl mx-auto font-display font-bold uppercase tracking-wide leading-tight">
              JOIN THOUSANDS OF STUDENTS ALREADY SHARING, SAVING, AND BUILDING COMMUNITY THROUGH PEER-TO-PEER RENTALS.
            </p>
            <div className={`flex flex-col sm:flex-row gap-6 justify-center ${ctaInView ? 'animate-bounce-hard delay-200' : 'opacity-0'}`}>
              <Link to="/login" data-cursor-interactive="true">
                <Button size="lg" className="flex items-center space-x-3">
                  <span>GET STARTED</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/browse" data-cursor-interactive="true">
                <Button variant="outline" size="lg">
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