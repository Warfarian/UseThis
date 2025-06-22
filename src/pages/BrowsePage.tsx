import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase, Item, Category } from '../lib/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
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
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchItems()
  }, [searchTerm, selectedCategory, priceRange.min, priceRange.max, sortBy])

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
    setLoading(true)
    try {
      let query = supabase
        .from('items')
        .select(`
          *,
          owner:users(name, rating)
        `)
        .eq('is_available', true)

      if (searchTerm.trim()) {
        query = query.or(`title.ilike.%${searchTerm.trim()}%,description.ilike.%${searchTerm.trim()}%`)
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      if (priceRange.min && !isNaN(parseFloat(priceRange.min))) {
        query = query.gte('price_per_day', parseFloat(priceRange.min))
      }

      if (priceRange.max && !isNaN(parseFloat(priceRange.max))) {
        query = query.lte('price_per_day', parseFloat(priceRange.max))
      }

      // Handle sorting
      if (sortBy === 'price_per_day') {
        query = query.order('price_per_day', { ascending: true })
      } else if (sortBy === 'title') {
        query = query.order('title', { ascending: true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

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
    updateSearchParams()
    fetchItems()
  }

  const updateSearchParams = () => {
    const params = new URLSearchParams()
    if (searchTerm.trim()) params.set('search', searchTerm.trim())
    if (selectedCategory) params.set('category', selectedCategory)
    setSearchParams(params)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    // Fetch will be triggered by useEffect
  }

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [field]: value }))
    // Fetch will be triggered by useEffect with a slight delay
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    // Fetch will be triggered by useEffect
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
    setSortBy('created_at')
    setSearchParams({})
    // fetchItems will be called by useEffect when state changes
  }

  return (
    <div className="min-h-screen bg-pure-black noise py-6 sm:py-8 px-4 sm:px-6 pt-20 sm:pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-huge font-black text-pure-white mb-3 sm:mb-4 font-display">
            BROWSE <span className="text-primary">ITEMS</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-concrete font-display font-bold uppercase tracking-wide">
            DISCOVER WHAT YOUR COMMUNITY IS SHARING
          </p>
          <div className="divider-brutal mt-4 sm:mt-6" />
        </div>

        {/* Search and Filters - Responsive */}
        <div className="mb-8 sm:mb-12">
          <form onSubmit={handleSearch} className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="SEARCH ITEMS..."
                    className="input-brutal pl-10 sm:pl-12 w-full text-sm sm:text-base"
                  />
                </div>
              </div>
              <Button type="submit" className="flex items-center justify-center space-x-2 px-6 sm:px-8">
                <Search size={16} />
                <span className="text-sm sm:text-base">SEARCH</span>
              </Button>
            </div>
          </form>

          {/* Mobile Filter Toggle */}
          <div className="sm:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Filter size={16} />
              <span>FILTERS</span>
            </Button>
          </div>

          {/* Filters Row - Responsive */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                CATEGORY
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-brutal w-full text-sm sm:text-base"
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
              <label className="block text-xs sm:text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                MIN PRICE
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                placeholder="$0"
                className="input-brutal w-full text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                MAX PRICE
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                placeholder="$999"
                className="input-brutal w-full text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                SORT BY
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input-brutal w-full text-sm sm:text-base"
              >
                <option value="created_at">NEWEST</option>
                <option value="price_per_day">PRICE LOW TO HIGH</option>
                <option value="title">NAME A-Z</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-steel font-display font-bold uppercase tracking-wide text-xs sm:text-sm">
              {loading ? 'SEARCHING...' : `${items.length} ITEMS FOUND`}
            </div>
            <Button variant="ghost" onClick={clearFilters} className="flex items-center justify-center space-x-2 w-full sm:w-auto">
              <Filter size={14} />
              <span className="text-xs sm:text-sm">CLEAR FILTERS</span>
            </Button>
          </div>
        </div>

        {/* Items Grid - Responsive */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="loading-brutal h-80 sm:h-96">{}</Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 border-4 border-steel flex items-center justify-center">
              <Search size={24} sm:size={32} className="text-steel" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-pure-white mb-3 sm:mb-4 font-display">
              NO ITEMS FOUND
            </h3>
            <p className="text-steel font-display font-bold uppercase tracking-wide mb-4 sm:mb-6">
              TRY ADJUSTING YOUR SEARCH OR FILTERS
            </p>
            <Button onClick={clearFilters}>
              CLEAR FILTERS
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {items.map((item) => (
              <Link key={item.id} to={`/item/${item.id}`}>
                <Card className="group h-full flex flex-col p-4 sm:p-6">
                  {/* Image */}
                  <div className="aspect-video bg-steel/20 mb-3 sm:mb-4 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url.split(',')[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-steel font-display font-bold uppercase tracking-wide text-xs sm:text-sm">
                          NO IMAGE
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <h3 className="text-sm sm:text-base lg:text-lg font-black text-pure-white font-display group-hover:text-primary transition-colors duration-100 uppercase line-clamp-2 flex-1 mr-2">
                        {item.title}
                      </h3>
                      <div className="text-primary font-black text-sm sm:text-base lg:text-lg font-mono whitespace-nowrap">
                        {formatPrice(item.price_per_day)}/DAY
                      </div>
                    </div>

                    <p className="text-steel text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 font-display font-medium">
                      {item.description}
                    </p>

                    <div className="mt-auto space-y-2 sm:space-y-3">
                      <div className="flex items-center text-steel text-xs sm:text-sm">
                        <MapPin size={12} sm:size={14} className="mr-1 sm:mr-2" />
                        <span className="font-display font-bold uppercase tracking-wide truncate">
                          {item.location}
                        </span>
                      </div>

                      <div className="flex items-center text-steel text-xs sm:text-sm">
                        <Calendar size={12} sm:size={14} className="mr-1 sm:mr-2" />
                        <span className="font-display font-bold uppercase tracking-wide">
                          AVAILABLE NOW
                        </span>
                      </div>

                      {item.owner && (
                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t-2 border-steel/30">
                          <div className="flex items-center min-w-0 flex-1">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <span className="text-pure-white font-bold text-xs sm:text-sm">
                                {item.owner.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-steel font-display font-bold uppercase tracking-wide text-xs sm:text-sm truncate">
                              {item.owner.name}
                            </span>
                          </div>
                          <div className="flex items-center ml-2">
                            <Star size={12} sm:size={14} className="text-accent mr-1" />
                            <span className="text-accent font-mono font-bold text-xs sm:text-sm">
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
}