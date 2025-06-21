import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Item } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatPrice } from '../lib/utils'
import { Search, Plus, TrendingUp, Zap, Gamepad2, ChefHat } from 'lucide-react'

export const HomePage: React.FC = () => {
  const [mode, setMode] = useState<'need' | 'have'>('need')
  const [featuredItems, setFeaturedItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

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
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-ink mb-6 font-primary">
              Share.{' '}
              <span className="text-accent-1 animate-glow">Borrow.</span>{' '}
              <span className="text-accent-2">Thrive.</span>
            </h1>
            <p className="text-xl md:text-2xl text-focus max-w-3xl mx-auto leading-relaxed">
              The peer-to-peer rental platform built for college students. 
              Turn your unused items into income, or find exactly what you need.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-12">
            <div className="inline-flex bg-canvas/50 backdrop-blur-sm rounded-full p-2 border border-ink/20">
              <button
                onClick={() => setMode('need')}
                className={`px-8 py-4 rounded-full font-medium transition-all duration-300 slot-machine ${
                  mode === 'need'
                    ? 'bg-accent-1 text-canvas shadow-lg'
                    : 'text-ink hover:text-accent-1'
                }`}
              >
                I Need Something
              </button>
              <button
                onClick={() => setMode('have')}
                className={`px-8 py-4 rounded-full font-medium transition-all duration-300 slot-machine ${
                  mode === 'have'
                    ? 'bg-accent-2 text-canvas shadow-lg'
                    : 'text-ink hover:text-accent-2'
                }`}
              >
                I Have Something
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {mode === 'need' ? (
              <>
                <Link to="/browse">
                  <Button size="lg" className="flex items-center space-x-2">
                    <Search size={20} />
                    <span>Browse Items</span>
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="secondary" size="lg">
                    You're Gonna Wanna Click This
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/add-listing">
                  <Button size="lg" className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>List Your Item</span>
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="secondary" size="lg">
                    Manage Listings
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-1/20 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-2/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-focus/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </section>

      {/* Popular Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4 font-primary">
              Popular Categories
            </h2>
            <p className="text-xl text-focus">
              What students are sharing most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(({ name, icon: Icon, color }) => (
              <Link key={name} to={`/browse?category=${encodeURIComponent(name)}`}>
                <Card className="text-center group cursor-spark">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-${color}/20 rounded-full flex items-center justify-center group-hover:animate-jitter`}>
                    <Icon size={32} className={`text-${color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-2">{name}</h3>
                  <p className="text-focus">Discover available items</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4 font-primary flex items-center">
                <TrendingUp className="mr-4 text-accent-1" />
                Trending Now
              </h2>
              <p className="text-xl text-focus">
                Items that are in high demand
              </p>
            </div>
            <Link to="/browse">
              <Button variant="secondary">View All</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-focus/20 rounded-2xl mb-4" />
                  <div className="h-4 bg-focus/20 rounded mb-2" />
                  <div className="h-4 bg-focus/20 rounded w-2/3" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.map((item) => (
                <Link key={item.id} to={`/item/${item.id}`}>
                  <Card className="group">
                    <div className="aspect-video bg-focus/10 rounded-2xl mb-4 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-focus">No image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-ink mb-2 group-hover:text-accent-1 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-focus text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent-1 font-bold">
                        {formatPrice(item.price_per_day)}/day
                      </span>
                      <span className="text-focus text-sm">
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
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-ink mb-6 font-primary">
            Ready to{' '}
            <span className="text-accent-1">UseThis</span>?
          </h2>
          <p className="text-xl text-focus mb-8 max-w-2xl mx-auto">
            Join thousands of students already sharing, saving, and building community through peer-to-peer rentals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button size="lg">Let's Play</Button>
            </Link>
            <Link to="/add-listing">
              <Button variant="secondary" size="lg">Try Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}