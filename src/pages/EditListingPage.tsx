import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, Category, Item } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { ArrowLeft, Upload, DollarSign, MapPin, Calendar, Image, Link, X } from 'lucide-react'

export const EditListingPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingItem, setFetchingItem] = useState(true)
  const [imageUploadMethod, setImageUploadMethod] = useState<'upload' | 'url'>('upload')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
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
    if (id) {
      fetchItem()
    }
  }, [id])

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

  const fetchItem = async () => {
    if (!id || !user) return

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id) // Ensure user owns this item
        .single()

      if (error) throw error

      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        price_per_day: data.price_per_day.toString(),
        availability_start_date: data.availability_start_date,
        availability_end_date: data.availability_end_date,
        image_url: data.image_url
      })

      // Set up image previews from existing URLs
      if (data.image_url) {
        const urls = data.image_url.split(',').filter(url => url.trim())
        setImagePreviews(urls)
      }
    } catch (error) {
      console.error('Error fetching item:', error)
      alert('Item not found or you do not have permission to edit it.')
      navigate('/profile')
    } finally {
      setFetchingItem(false)
    }
  }

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate files
    const validFiles: File[] = []
    const newPreviews: string[] = []

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file`)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`)
        return
      }

      validFiles.push(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string)
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    setImageFiles(prev => [...prev, ...validFiles])
    setErrors(prev => ({ ...prev, image: '' }))
  }

  const handleImageUrlAdd = () => {
    const url = formData.image_url.trim()
    if (!url) return

    if (!isValidUrl(url)) {
      setErrors(prev => ({ ...prev, image: 'Please provide a valid image URL' }))
      return
    }

    setImagePreviews(prev => [...prev, url])
    setFormData(prev => ({ ...prev, image_url: '' }))
    setErrors(prev => ({ ...prev, image: '' }))
  }

  const removeImagePreview = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    if (index < imageFiles.length) {
      setImageFiles(prev => prev.filter((_, i) => i !== index))
    }
  }

  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `item-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath)

      return publicUrl
    })

    return Promise.all(uploadPromises)
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
    
    // At least one image is required
    if (imagePreviews.length === 0) {
      newErrors.image = 'At least one image is required'
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
    
    if (!validateForm() || !user || !id) return

    setLoading(true)
    try {
      let finalImageUrls: string[] = []

      // Upload new image files if any
      if (imageFiles.length > 0) {
        setUploadingImages(true)
        const uploadedUrls = await uploadImagesToSupabase(imageFiles)
        finalImageUrls = [...finalImageUrls, ...uploadedUrls]
      }

      // Add existing URLs that weren't removed
      const existingUrls = imagePreviews.filter(url => isValidUrl(url))
      finalImageUrls = [...finalImageUrls, ...existingUrls]

      const { error } = await supabase
        .from('items')
        .update({
          ...formData,
          price_per_day: parseFloat(formData.price_per_day),
          image_url: finalImageUrls.join(',')
        })
        .eq('id', id)

      if (error) throw error

      alert('Listing updated successfully!')
      navigate('/profile')
    } catch (error) {
      console.error('Error updating listing:', error)
      alert('Failed to update listing. Please try again.')
    } finally {
      setLoading(false)
      setUploadingImages(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const triggerFileInput = () => {
    const fileInput = document.getElementById('image-upload-input') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  const today = new Date().toISOString().split('T')[0]

  if (fetchingItem) {
    return (
      <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
        <div className="max-w-4xl mx-auto">
          <Card className="loading-brutal h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="mb-6 flex items-center space-x-2"
          >
            <ArrowLeft size={18} />
            <span>BACK TO PROFILE</span>
          </Button>

          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            EDIT <span className="text-primary">LISTING</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            UPDATE YOUR ITEM DETAILS
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

            {/* Images */}
            <div>
              <h2 className="text-2xl font-black text-pure-white mb-6 font-display uppercase">
                ITEM IMAGES <span className="text-crimson">*REQUIRED</span>
              </h2>
              
              {/* Upload Method Toggle */}
              <div className="mb-6">
                <div className="inline-flex glass-brutal border-2 border-steel">
                  <button
                    type="button"
                    onClick={() => setImageUploadMethod('upload')}
                    className={`px-6 py-3 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 flex items-center space-x-2 ${
                      imageUploadMethod === 'upload'
                        ? 'bg-primary text-pure-white'
                        : 'text-pure-white hover:text-primary'
                    }`}
                  >
                    <Upload size={16} />
                    <span>UPLOAD FILES</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadMethod('url')}
                    className={`px-6 py-3 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 flex items-center space-x-2 ${
                      imageUploadMethod === 'url'
                        ? 'bg-primary text-pure-white'
                        : 'text-pure-white hover:text-primary'
                    }`}
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
                    UPLOAD IMAGE FILES
                  </label>
                  
                  {/* Hidden file input */}
                  <input
                    id="image-upload-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFilesChange}
                    style={{ display: 'none' }}
                  />
                  
                  {/* Clickable upload area */}
                  <div 
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-steel hover:border-primary transition-colors p-8 text-center cursor-pointer bg-charcoal hover:bg-charcoal/80"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 border-2 border-steel flex items-center justify-center hover:border-primary transition-colors">
                        <Upload size={24} className="text-steel" />
                      </div>
                      <div>
                        <p className="text-pure-white font-display font-bold uppercase tracking-wide">
                          CLICK TO UPLOAD IMAGES
                        </p>
                        <p className="text-steel font-display font-medium text-sm mt-2">
                          JPG, PNG, GIF up to 5MB each • Multiple files allowed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steel z-10" size={20} />
                      <Input
                        label="IMAGE URL"
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => handleInputChange('image_url', e.target.value)}
                        placeholder="HTTPS://EXAMPLE.COM/IMAGE.JPG"
                        className="pl-12"
                      />
                    </div>
                    <div className="pt-8">
                      <Button
                        type="button"
                        onClick={handleImageUrlAdd}
                        disabled={!formData.image_url.trim()}
                        className="px-6"
                      >
                        ADD
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                    IMAGES ({imagePreviews.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square bg-steel/20 overflow-hidden border-2 border-steel">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => removeImagePreview(index)}
                        />
                        <button
                          type="button"
                          onClick={() => removeImagePreview(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-crimson flex items-center justify-center hover:bg-crimson/80 transition-colors"
                        >
                          <X size={14} className="text-pure-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.image && (
                <p className="text-sm text-crimson font-bold uppercase tracking-wide mt-2">
                  {errors.image}
                </p>
              )}
            </div>

            <div className="divider-brutal" />

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/profile')}
                className="sm:w-auto"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={loading || uploadingImages}
                className="sm:w-auto"
              >
                {uploadingImages ? 'UPLOADING IMAGES...' : loading ? 'UPDATING LISTING...' : 'UPDATE LISTING'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}