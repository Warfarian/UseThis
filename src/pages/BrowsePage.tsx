import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase, Item, Category } from '../lib/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { formatPrice } from '../lib/utils'
import { Search, Filter, MapPin, Calendar, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export const BrowsePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    fetchCategories()
    fetchItems()
  }, [searchTerm, selectedCategory, sortBy])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchItems = async () => {
    try {
      let query = supabase
        .from('items')
        .select(`
          *,
          owner:users(name, rating)
        `)
        .eq('is_available', true)

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      if (priceRange.min) {
        query = query.gte('price_per_day', parseFloat(priceRange.min))
      }

      if (priceRange.max) {
        query = query.lte('price_per_day', parseFloat(priceRange.max))
      }

      const { data, error } = await query.order(sortBy, { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    setSearchParams(params)
    fetchItems()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
    setSortBy('created_at')
    setSearchParams({})
    fetchItems()
  }

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            BROWSE <span className="text-primary">ITEMS</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            DISCOVER WHAT YOUR COMMUNITY IS SHARING
          </p>
          <div className="divider-brutal mt-6" />
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="SEARCH ITEMS..."
                    className="input-brutal pl-12 w-full"
                  />
                </div>
              </div>
              <Button type="submit" className="flex items-center space-x-2">
                <Search size={18} />
                <span>SEARCH</span>
              </Button>
            </div>
          </form>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                CATEGORY
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-brutal w-full"
              >
                <option value="">ALL CATEGORIES</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                MIN PRICE
              </label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                placeholder="$0"
                className="input-brutal w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                MAX PRICE
              </label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                placeholder="$999"
                className="input-brutal w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                SORT BY
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-brutal w-full"
              >
                <option value="created_at">NEWEST</option>
                <option value="price_per_day">PRICE LOW</option>
                <option value="title">NAME A-Z</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-steel font-display font-bold uppercase tracking-wide text-sm">
              {items.length} ITEMS FOUND
            </div>
            <Button variant="ghost" onClick={clearFilters} className="flex items-center space-x-2">
              <Filter size={16} />
              <span>CLEAR FILTERS</span>
            </Button>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid-brutal">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="loading-brutal h-96" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 border-4 border-steel flex items-center justify-center">
              <Search size={32} className="text-steel" />
            </div>
            <h3 className="text-2xl font-black text-pure-white mb-4 font-display">
              NO ITEMS FOUND
            </h3>
            <p className="text-steel font-display font-bold uppercase tracking-wide">
              TRY ADJUSTING YOUR SEARCH OR FILTERS
            </p>
            <Button onClick={clearFilters} className="mt-6">
              CLEAR FILTERS
            </Button>
          </div>
        ) : (
          <div className="grid-brutal">
            {items.map((item) => (
              <Link key={item.id} to={`/item/${item.id}`}>
                <Card className="group h-full flex flex-col">
                  {/* Image */}
                  <div className="aspect-video bg-steel/20 mb-4 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                          NO IMAGE
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-black text-pure-white font-display group-hover:text-primary transition-colors duration-100 uppercase line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="text-primary font-black text-lg font-mono ml-2">
                        {formatPrice(item.price_per_day)}/DAY
                      </div>
                    </div>

                    <p className="text-steel text-sm mb-4 line-clamp-2 font-display font-medium">
                      {item.description}
                    </p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center text-steel text-sm">
                        <MapPin size={14} className="mr-2" />
                        <span className="font-display font-bold uppercase tracking-wide">
                          {item.location}
                        </span>
                      </div>

                      <div className="flex items-center text-steel text-sm">
                        <Calendar size={14} className="mr-2" />
                        <span className="font-display font-bold uppercase tracking-wide">
                          AVAILABLE NOW
                        </span>
                      </div>

                      {item.owner && (
                        <div className="flex items-center justify-between pt-3 border-t-2 border-steel/30">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary flex items-center justify-center mr-3">
                              <span className="text-pure-white font-bold text-sm">
                                {item.owner.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                              {item.owner.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star size={14} className="text-accent mr-1" />
                            <span className="text-accent font-mono font-bold text-sm">
                              {item.owner.rating?.toFixed(1) || '5.0'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )