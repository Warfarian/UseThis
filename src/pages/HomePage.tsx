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
    { name: 'Appliances', icon: Zap, color: 'accent-1' },
    { name: 'Gaming Consoles', icon: Gamepad2, color: 'accent-2' },
    { name: 'Kitchen', icon: ChefHat, color: 'accent-1' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden" ref={heroRef}>
        <div className="max-w-7xl mx-auto text-center">
          <div className={`mb-12 animate-on-scroll ${heroInView ? 'in-view' : ''}`}>
            <h1 className="text-7xl md:text-9xl font-bold text-ink mb-8 font-primary leading-none">
              Share.{' '}
              <span className="text-gradient">Borrow.</span>{' '}
              <br />
              <span className="text-accent-2">Thrive.</span>
            </h1>
            <p className="text-xl md:text-2xl text-focus max-w-4xl mx-auto leading-relaxed font-body">
              The peer-to-peer rental platform built for college students. 
              Turn your unused items into income, or find exactly what you need.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className={`mb-16 animate-on-scroll stagger-1 ${heroInView ? 'in-view' : ''}`}>
            <div className="inline-flex glass rounded-full p-2 border border-ink/10">
              <button
                onClick={() => setMode('need')}
                data-cursor-interactive="true"
                className={`px-10 py-4 rounded-full font-medium font-body transition-all duration-500 ${
                  mode === 'need'
                    ? 'bg-gradient-to-r from-accent-1 to-accent-2 text-canvas shadow-lg glow-accent'
                    : 'text-ink hover:text-accent-1'
                }`}
              >
                I Need Something
              </button>
              <button
                onClick={() => setMode('have')}
                data-cursor-interactive="true"
                className={`px-10 py-4 rounded-full font-medium font-body transition-all duration-500 ${
                  mode === 'have'
                    ? 'bg-gradient-to-r from-accent-1 to-accent-2 text-canvas shadow-lg glow-accent'
                    : 'text-ink hover:text-accent-1'
                }`}
              >
                I Have Something
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-on-scroll stagger-2 ${heroInView ? 'in-view' : ''}`}>
            {mode === 'need' ? (
              <>
                <Link to="/browse" data-cursor-interactive="true">
                  <Button size="lg" className="flex items-center space-x-3">
                    <Search size={20} />
                    <span>Browse Items</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/login" data-cursor-interactive="true">
                  <Button variant="secondary" size="lg">
                    Join the Community
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/add-listing" data-cursor-interactive="true">
                  <Button size="lg" className="flex items-center space-x-3">
                    <Plus size={20} />
                    <span>List Your Item</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/profile" data-cursor-interactive="true">
                  <Button variant="secondary" size="lg">
                    Manage Listings
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-accent-1/10 to-accent-2/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-gradient-to-br from-accent-2/10 to-accent-1/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-focus/10 to-muted/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </section>

      {/* Popular Categories */}
      <section className="py-24 px-6" ref={categoriesRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 animate-on-scroll ${categoriesInView ? 'in-view' : ''}`}>
            <h2 className="text-5xl md:text-6xl font-bold text-ink mb-6 font-primary">
              Popular Categories
            </h2>
            <p className="text-xl text-focus font-body">
              What students are sharing most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(({ name, icon: Icon, color }, index) => (
              <Link key={name} to={`/browse?category=${encodeURIComponent(name)}`}>
                <Card className={`text-center group animate-on-scroll stagger-${index + 1} ${categoriesInView ? 'in-view' : ''}`}>
                  <div className="w-20 h-20 mx-auto mb-6 glass rounded-full flex items-center justify-center border border-accent-1/20 group-hover:border-accent-1/50 transition-all duration-500">
                    <Icon size={36} className="text-accent-1 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-ink mb-3 font-primary group-hover:text-accent-1 transition-colors duration-300">{name}</h3>
                  <p className="text-focus font-body">Discover available items</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-24 px-6" ref={featuredRef}>
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between mb-16 animate-on-scroll ${featuredInView ? 'in-view' : ''}`}>
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-ink mb-6 font-primary flex items-center">
                <TrendingUp className="mr-6 text-accent-1" size={48} />
                Trending Now
              </h2>
              <p className="text-xl text-focus font-body">
                Items that are in high demand
              </p>
            </div>
            <Link to="/browse" data-cursor-interactive="true">
              <Button variant="secondary" className="flex items-center space-x-2">
                <span>View All</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-56 bg-focus/10 rounded-2xl mb-6" />
                  <div className="h-6 bg-focus/10 rounded mb-3" />
                  <div className="h-4 bg-focus/10 rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item, index) => (
                <Link key={item.id} to={`/item/${item.id}`}>
                  <Card className={`group animate-on-scroll stagger-${(index % 3) + 1} ${featuredInView ? 'in-view' : ''}`}>
                    <div className="aspect-video bg-focus/5 rounded-2xl mb-6 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-focus font-body">No image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-ink mb-3 font-primary group-hover:text-accent-1 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-focus text-sm mb-4 line-clamp-2 font-body">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent-1 font-bold text-lg font-body">
                        {formatPrice(item.price_per_day)}/day
                      </span>
                      <span className="text-focus text-sm font-body">
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
      <section className="py-32 px-6" ref={ctaRef}>
        <div className="max-w-5xl mx-auto text-center">
          <div className={`animate-on-scroll ${ctaInView ? 'in-view' : ''}`}>
            <h2 className="text-6xl md:text-8xl font-bold text-ink mb-8 font-primary leading-none">
              Ready to{' '}
              <span className="text-gradient">UseThis</span>?
            </h2>
            <p className="text-xl text-focus mb-12 max-w-3xl mx-auto font-body leading-relaxed">
              Join thousands of students already sharing, saving, and building community through peer-to-peer rentals.
            </p>
            <div className={`flex flex-col sm:flex-row gap-6 justify-center animate-on-scroll stagger-1 ${ctaInView ? 'in-view' : ''}`}>
              <Link to="/login" data-cursor-interactive="true">
                <Button size="lg" className="flex items-center space-x-3">
                  <span>Get Started</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/browse" data-cursor-interactive="true">
                <Button variant="secondary" size="lg">
                  Explore Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}