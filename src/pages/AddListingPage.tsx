import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, Category } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { ArrowLeft, Upload, DollarSign, MapPin, Calendar, Image, Link } from 'lucide-react'

export const AddListingPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUploadMethod, setImageUploadMethod] = useState<'upload' | 'url'>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }))
        return
      }

      setImageFile(file)
      setErrors(prev => ({ ...prev, image: '' }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
    setImagePreview(url)
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }))
    }
  }

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`
    const filePath = `item-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(filePath)

    return publicUrl
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
    
    // Image validation - now mandatory
    if (imageUploadMethod === 'upload') {
      if (!imageFile) {
        newErrors.image = 'Please select an image file'
      }
    } else {
      if (!formData.image_url.trim()) {
        newErrors.image = 'Please provide an image URL'
      } else if (!isValidUrl(formData.image_url)) {
        newErrors.image = 'Please provide a valid image URL'
      }
    }
    
    if (formData.availability_start_date && formData.availability_end_date) {
      if (new Date(formData.availability_end_date) <= new Date(formData.availability_start_date)) {
        newErrors.availability_end_date = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    setLoading(true)
    try {
      let finalImageUrl = formData.image_url

      // Upload image if using file upload method
      if (imageUploadMethod === 'upload' && imageFile) {
        setUploadingImage(true)
        finalImageUrl = await uploadImageToSupabase(imageFile)
      }

      const { error } = await supabase
        .from('items')
        .insert({
          ...formData,
          price_per_day: parseFloat(formData.price_per_day),
          owner_id: user.id,
          image_url: finalImageUrl,
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
      setUploadingImage(false)
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
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
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
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
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
                  style={{ cursor: 'text', pointerEvents: 'auto' }}
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

            {/* Image Upload - Now Mandatory */}
            <div>
              <h2 className="text-2xl font-black text-pure-white mb-6 font-display uppercase">
                ITEM IMAGE <span className="text-crimson">*REQUIRED</span>
              </h2>
              
              {/* Upload Method Toggle */}
              <div className="mb-6">
                <div className="inline-flex glass-brutal border-2 border-steel">
                  <button
                    type="button"
                    onClick={() => {
                      setImageUploadMethod('upload')
                      setFormData(prev => ({ ...prev, image_url: '' }))
                      setImagePreview('')
                    }}
                    className={`px-6 py-3 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 flex items-center space-x-2 ${
                      imageUploadMethod === 'upload'
                        ? 'bg-primary text-pure-white'
                        : 'text-pure-white hover:text-primary'
                    }`}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  >
                    <Upload size={16} />
                    <span>UPLOAD FILE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUploadMethod('url')
                      setImageFile(null)
                      setImagePreview('')
                    }}
                    className={`px-6 py-3 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 flex items-center space-x-2 ${
                      imageUploadMethod === 'url'
                        ? 'bg-primary text-pure-white'
                        : 'text-pure-white hover:text-primary'
                    }`}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  >
                    <Link size={16} />
                    <span>IMAGE URL</span>
                  </button>
                </div>
              </div>

              {/* Upload Method Content */}
              {imageUploadMethod === 'upload' ? (
                <div>
                  <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                    UPLOAD IMAGE FILE
                  </label>
                  <div className="border-2 border-dashed border-steel hover:border-primary transition-colors p-8 text-center relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      style={{ cursor: 'pointer !important', pointerEvents: 'auto !important' }}
                      id="image-upload"
                    />
                    <div className="flex flex-col items-center space-y-4 pointer-events-none">
                      <div className="w-16 h-16 border-2 border-steel flex items-center justify-center hover:border-primary transition-colors">
                        <Upload size={24} className="text-steel" />
                      </div>
                      <div>
                        <p className="text-pure-white font-display font-bold uppercase tracking-wide">
                          CLICK TO UPLOAD IMAGE
                        </p>
                        <p className="text-steel font-display font-medium text-sm mt-2">
                          JPG, PNG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                  {imageFile && (
                    <p className="text-primary font-display font-bold text-sm mt-2">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={20} />
                  <Input
                    label="IMAGE URL"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="HTTPS://EXAMPLE.COM/IMAGE.JPG"
                    className="pl-12"
                  />
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-6">
                  <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                    PREVIEW
                  </label>
                  <div className="w-full max-w-md aspect-video bg-steel/20 overflow-hidden border-2 border-steel">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setImagePreview('')
                        setErrors(prev => ({ ...prev, image: 'Invalid image URL or file' }))
                      }}
                    />
                  </div>
                </div>
              )}

              {errors.image && (
                <p className="text-sm text-crimson font-bold uppercase tracking-wide mt-2">
                  {errors.image}
                </p>
              )}
              
              <p className="text-steel font-display font-medium text-sm mt-2">
                <span className="text-crimson">*</span> An image is required to make your listing attractive and trustworthy
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
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={loading || uploadingImage}
                className="sm:w-auto"
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
              >
                {uploadingImage ? 'UPLOADING IMAGE...' : loading ? 'CREATING LISTING...' : 'CREATE LISTING'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}