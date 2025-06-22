import React, { useState, useEffect } from 'react'
import { supabase, Item, User as UserType } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { formatPrice, formatDate } from '../lib/utils'
import { User, Star, Package, Trash2, Plus, MapPin, Calendar, Camera, Archive, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserType | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({ name: '', email: '', bio: '' })
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('')
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchUserItems()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
      setProfileData({ 
        name: data.name, 
        email: data.email, 
        bio: data.bio || '' 
      })
      setProfilePicturePreview(data.profile_picture_url || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchUserItems = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching user items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB')
        return
      }

      setProfilePictureFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!profilePictureFile || !user) return null

    setUploadingPicture(true)
    try {
      const fileExt = profilePictureFile.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`
      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profilePictureFile, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      alert('Failed to upload profile picture. Please try again.')
      return null
    } finally {
      setUploadingPicture(false)
    }
  }

  const updateProfile = async () => {
    if (!user) return

    try {
      let profilePictureUrl = profile?.profile_picture_url

      // Upload new profile picture if selected
      if (profilePictureFile) {
        const uploadedUrl = await uploadProfilePicture()
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl
        }
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: profileData.name,
          email: profileData.email,
          bio: profileData.bio,
          profile_picture_url: profilePictureUrl
        })
        .eq('id', user.id)

      if (error) throw error
      
      setEditingProfile(false)
      setProfilePictureFile(null)
      fetchProfile()
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  const deleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      
      fetchUserItems()
      alert('Item deleted successfully!')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item. Please try again.')
    }
  }

  const toggleItemAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('items')
        .update({ is_available: !currentStatus })
        .eq('id', itemId)

      if (error) throw error
      
      fetchUserItems()
    } catch (error) {
      console.error('Error updating item availability:', error)
      alert('Failed to update item availability. Please try again.')
    }
  }

  const triggerProfilePictureInput = () => {
    const fileInput = document.getElementById('profile-picture-input') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  const filteredItems = showArchived ? items.filter(item => !item.is_available) : items.filter(item => item.is_available)

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
        <div className="max-w-6xl mx-auto">
          <Card className="loading-brutal h-96">
            <></>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            MY <span className="text-primary">PROFILE</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            MANAGE YOUR ACCOUNT AND LISTINGS
          </p>
          <div className="divider-brutal mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                {/* Profile Picture */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {profilePicturePreview || profile?.profile_picture_url ? (
                    <img
                      src={profilePicturePreview || profile?.profile_picture_url}
                      alt="Profile"
                      className="w-24 h-24 object-cover border-4 border-primary"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary flex items-center justify-center">
                      <span className="text-pure-white font-black text-3xl">
                        {profile?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {editingProfile && (
                    <>
                      <input
                        id="profile-picture-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        onClick={triggerProfilePictureInput}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent flex items-center justify-center border-2 border-pure-black hover:bg-accent/80 transition-colors"
                        disabled={uploadingPicture}
                      >
                        <Camera size={16} className="text-pure-white" />
                      </button>
                    </>
                  )}
                </div>
                
                {editingProfile ? (
                  <div className="space-y-4">
                    <Input
                      label="FULL NAME"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="YOUR NAME"
                    />
                    <Input
                      label="EMAIL ADDRESS"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="YOUR EMAIL"
                    />
                    <div>
                      <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                        BIO (OPTIONAL)
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="TELL OTHERS ABOUT YOURSELF..."
                        rows={3}
                        className="input-brutal w-full resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={updateProfile} disabled={uploadingPicture}>
                        {uploadingPicture ? 'UPLOADING...' : 'SAVE'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          setEditingProfile(false)
                          setProfilePictureFile(null)
                          setProfilePicturePreview(profile?.profile_picture_url || '')
                          setProfileData({ 
                            name: profile?.name || '', 
                            email: profile?.email || '', 
                            bio: profile?.bio || '' 
                          })
                        }}
                      >
                        CANCEL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-pure-white mb-2 font-display uppercase">
                      {profile?.name}
                    </h2>
                    <p className="text-steel font-display font-bold uppercase tracking-wide text-sm mb-4">
                      {profile?.email}
                    </p>
                    {profile?.bio && (
                      <div className="bg-charcoal border-l-4 border-primary p-3 mb-4 text-left">
                        <p className="text-concrete font-display font-medium text-sm leading-relaxed">
                          {profile.bio}
                        </p>
                      </div>
                    )}
                    <Button size="sm" onClick={() => setEditingProfile(true)} className="flex items-center space-x-2">
                      <User size={16} />
                      <span>EDIT PROFILE</span>
                    </Button>
                  </>
                )}
              </div>

              <div className="divider-brutal mb-6" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                    RATING
                  </span>
                  <div className="flex items-center">
                    <Star size={16} className="text-accent mr-1" />
                    <span className="text-accent font-mono font-bold">
                      {profile?.rating?.toFixed(1) || '5.0'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                    MEMBER SINCE
                  </span>
                  <span className="text-pure-white font-mono font-bold text-sm">
                    {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                    ACTIVE LISTINGS
                  </span>
                  <span className="text-primary font-mono font-bold">
                    {items.filter(item => item.is_available).length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                    ARCHIVED LISTINGS
                  </span>
                  <span className="text-steel font-mono font-bold">
                    {items.filter(item => !item.is_available).length}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-pure-white font-display uppercase">
                MY LISTINGS
              </h2>
              <div className="flex items-center space-x-4">
                {/* Archive Toggle */}
                <div className="inline-flex glass-brutal border-2 border-steel">
                  <button
                    onClick={() => setShowArchived(false)}
                    className={`px-4 py-2 font-bold font-display text-xs uppercase tracking-wide transition-all duration-100 ${
                      !showArchived
                        ? 'bg-primary text-pure-white'
                        : 'text-pure-white hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <Eye size={12} />
                      <span>ACTIVE</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowArchived(true)}
                    className={`px-4 py-2 font-bold font-display text-xs uppercase tracking-wide transition-all duration-100 ${
                      showArchived
                        ? 'bg-primary text-pure-white'
                        : 'text-pure-white hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <Archive size={12} />
                      <span>ARCHIVED</span>
                    </div>
                  </button>
                </div>
                
                <Link to="/add-listing">
                  <Button className="flex items-center space-x-2">
                    <Plus size={18} />
                    <span>ADD LISTING</span>
                  </Button>
                </Link>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <Card className="text-center py-12">
                {showArchived ? (
                  <>
                    <Archive size={48} className="mx-auto mb-4 text-steel" />
                    <h3 className="text-xl font-black text-pure-white mb-4 font-display">
                      NO ARCHIVED LISTINGS
                    </h3>
                    <p className="text-steel font-display font-bold uppercase tracking-wide mb-6">
                      ARCHIVED ITEMS WILL APPEAR HERE
                    </p>
                    <Button onClick={() => setShowArchived(false)}>
                      VIEW ACTIVE LISTINGS
                    </Button>
                  </>
                ) : (
                  <>
                    <Package size={48} className="mx-auto mb-4 text-steel" />
                    <h3 className="text-xl font-black text-pure-white mb-4 font-display">
                      NO ACTIVE LISTINGS
                    </h3>
                    <p className="text-steel font-display font-bold uppercase tracking-wide mb-6">
                      START SHARING YOUR ITEMS TO EARN MONEY
                    </p>
                    <Link to="/add-listing">
                      <Button>CREATE YOUR FIRST LISTING</Button>
                    </Link>
                  </>
                )}
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Item Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-20 h-20 bg-steel/20 flex-shrink-0 overflow-hidden">
                          {item.image_url ? (
                            <img
                              src={item.image_url.split(',')[0]}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={24} className="text-steel" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-black text-pure-white font-display uppercase">
                              {item.title}
                            </h3>
                            <div className="text-primary font-black font-mono">
                              {formatPrice(item.price_per_day)}/DAY
                            </div>
                          </div>

                          <p className="text-steel text-sm mb-3 line-clamp-2 font-display font-medium">
                            {item.description}
                          </p>

                          <div className="flex items-center space-x-4 text-steel text-sm">
                            <div className="flex items-center">
                              <MapPin size={14} className="mr-1" />
                              <span className="font-display font-bold uppercase tracking-wide">
                                {item.location}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              <span className="font-display font-bold uppercase tracking-wide">
                                {formatDate(item.created_at)}
                              </span>
                            </div>
                            <div className={`font-display font-bold uppercase tracking-wide ${
                              item.is_available ? 'text-primary' : 'text-steel'
                            }`}>
                              {item.is_available ? 'ACTIVE' : 'ARCHIVED'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-32">
                        <Link to={`/item/${item.id}`}>
                          <Button size="sm" variant="outline" className="w-full flex items-center justify-center space-x-1">
                            <Eye size={14} />
                            <span>VIEW</span>
                          </Button>
                        </Link>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleItemAvailability(item.id, item.is_available)}
                          className="w-full flex items-center justify-center space-x-1"
                        >
                          <Archive size={14} />
                          <span>{item.is_available ? 'ARCHIVE' : 'UNARCHIVE'}</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteItem(item.id)}
                          className="w-full flex items-center justify-center space-x-1 text-crimson hover:text-crimson"
                        >
                          <Trash2 size={14} />
                          <span>DELETE</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}