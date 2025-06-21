import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, Category } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { ArrowLeft, Upload, DollarSign, MapPin, Calendar } from 'lucide-react'

export const AddListingPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    price_per_day: '',
    availability_start_date: '',
    availability_end_date: '',
    image_url: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCategories()
  }, [])

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.price_per_day || parseFloat(formData.price_per_day) <= 0) {
      newErrors.price_per_day = 'Valid price is required'
    }
    if (!formData.availability_start_date) newErrors.availability_start_date = 'Start date is required'
    if (!formData.availability_end_date) newErrors.availability_end_date = 'End date is required'
    
    if (formData.availability_start_date && formData.availability_end_date) {
      if (new Date(formData.availability_end_date) <= new Date(formData.availability_start_date)) {
        newErrors.availability_end_date = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('items')
        .insert({
          ...formData,
          price_per_day: parseFloat(formData.price_per_day),
          owner_id: user.id,
          is_available: true
        })

      if (error) throw error

      alert('Item listed successfully!')
      navigate('/profile')
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="mb-6 flex items-center space-x-2"
          >
            <ArrowLeft size={18} />
            <span>BACK TO HOME</span>
          </Button>

          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            LIST YOUR <span className="text-primary">ITEM</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            SHARE WHAT YOU HAVE AND EARN MONEY
          </p>
          <div className="divider-brutal mt-6" />
        </div>

        {/* Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-black text-pure-white mb-6 font-display uppercase">
                BASIC INFORMATION
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="ITEM TITLE"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="WHAT ARE YOU SHARING?"
                    error={errors.title}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                    CATEGORY
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input-brutal w-full"
                  >
                    <option value="">SELECT CATEGORY</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-crimson font-bold uppercase tracking-wide mt-2">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                  DESCRIPTION
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="DESCRIBE YOUR ITEM IN DETAIL..."
                  rows={4}
                  className="input-brutal w-full resize-none"
                />
                {errors.description && (
                  <p className="text-sm text-crimson font-bold uppercase tracking-wide mt-2">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="divider-brutal" />

            {/* Location & Pricing */}
            <div>
              <h2 className="text-2xl font-black text-pure-white mb-6 font-display uppercase">
                LOCATION & PRICING
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={20} />
                    <Input
                      label="LOCATION"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="WHERE IS THIS ITEM?"
                      className="pl-12"
                      error={errors.location}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={20} />
                    <Input
                      label="PRICE PER DAY"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_day}
                      onChange={(e) => handleInputChange('price_per_day', e.target.value)}
                      placeholder="0.00"
                      className="pl-12"
                      error={errors.price_per_day}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="divider-brutal" />

            {/* Availability */}
            <div>
              <h2 className="text-2xl font-black text-pure-white mb-6 font-display uppercase">
                AVAILABILITY
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={20} />
                    <Input
                      label="AVAILABLE FROM"
                      type="date"
                      value={formData.availability_start_date}
                      onChange={(e) => handleInputChange('availability_start_date', e.target.value)}
                      min={today}
                      className="pl-12"
                      error={errors.availability_start_date}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={20} />
                    <Input
                      label="AVAILABLE UNTIL"
                      type="date"
                      value={formData.availability_end_date}
                      onChange={(e) => handleInputChange('availability_end_date', e.target.value)}
                      min={formData.availability_start_date || today}
                      className="pl-12"
                      error={errors.availability_end_date}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="divider-brutal" />

            {/* Image */}
            <div>
              <h2 className="text-2xl font-black text-pure-white mb-6 font-display uppercase">
                ITEM IMAGE
              </h2>
              
              <div className="relative">
                <Upload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={20} />
                <Input
                  label="IMAGE URL (OPTIONAL)"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="HTTPS://EXAMPLE.COM/IMAGE.JPG"
                  className="pl-12"
                />
              </div>
              
              <p className="text-steel font-display font-medium text-sm mt-2">
                Add a photo URL to make your listing more attractive
              </p>
            </div>

            <div className="divider-brutal" />

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/home')}
                className="sm:w-auto"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="sm:w-auto"
              >
                {loading ? 'CREATING LISTING...' : 'CREATE LISTING'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}