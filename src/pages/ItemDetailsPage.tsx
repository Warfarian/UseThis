import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, Item, Booking } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatPrice, formatDate, calculateDays } from '../lib/utils'
import { ArrowLeft, MapPin, Calendar, Star, User, Shield, Clock } from 'lucide-react'

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    if (id) {
      fetchItem()
    }
  }, [id])

  useEffect(() => {
    if (startDate && endDate && item) {
      const days = calculateDays(startDate, endDate)
      setTotalPrice(days * item.price_per_day)
    }
  }, [startDate, endDate, item])

  const fetchItem = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          owner:users(id, name, rating, email)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setItem(data)
    } catch (error) {
      console.error('Error fetching item:', error)
      navigate('/browse')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!user || !item || !startDate || !endDate) return

    setBookingLoading(true)
    try {
      const days = calculateDays(startDate, endDate)
      const total = days * item.price_per_day

      const { error } = await supabase
        .from('bookings')
        .insert({
          item_id: item.id,
          renter_id: user.id,
          owner_id: item.owner_id,
          start_date: startDate,
          end_date: endDate,
          total_price: total,
          status: 'pending'
        })

      if (error) throw error

      alert('Booking request sent successfully!')
      navigate('/bookings')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black noise py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="loading-brutal h-96" />
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-pure-black noise py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            ITEM NOT FOUND
          </h1>
          <Button onClick={() => navigate('/browse')}>
            BACK TO BROWSE
          </Button>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === item.owner_id
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/browse')}
          className="mb-8 flex items-center space-x-2"
        >
          <ArrowLeft size={18} />
          <span>BACK TO BROWSE</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image and Details */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-steel/20 mb-6 overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-steel font-display font-bold uppercase tracking-wide">
                    NO IMAGE AVAILABLE
                  </span>
                </div>
              )}
            </div>

            {/* Item Info */}
            <Card className="mb-6">
              <h1 className="text-3xl font-black text-pure-white mb-4 font-display uppercase">
                {item.title}
              </h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-primary font-black text-2xl font-mono">
                  {formatPrice(item.price_per_day)}/DAY
                </div>
                <div className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                  {item.category}
                </div>
              </div>

              <div className="divider-brutal mb-6" />

              <p className="text-concrete font-display font-medium leading-relaxed mb-6">
                {item.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center text-steel">
                  <MapPin size={18} className="mr-3 text-primary" />
                  <span className="font-display font-bold uppercase tracking-wide">
                    {item.location}
                  </span>
                </div>

                <div className="flex items-center text-steel">
                  <Calendar size={18} className="mr-3 text-primary" />
                  <span className="font-display font-bold uppercase tracking-wide">
                    AVAILABLE: {formatDate(item.availability_start_date)} - {formatDate(item.availability_end_date)}
                  </span>
                </div>

                <div className="flex items-center text-steel">
                  <Clock size={18} className="mr-3 text-primary" />
                  <span className="font-display font-bold uppercase tracking-wide">
                    LISTED {formatDate(item.created_at)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Owner Info */}
            {item.owner && (
              <Card>
                <h3 className="text-xl font-black text-pure-white mb-4 font-display uppercase">
                  ITEM OWNER
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center mr-4">
                      <span className="text-pure-white font-black text-lg">
                        {item.owner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-pure-white font-display font-bold uppercase tracking-wide">
                        {item.owner.name}
                      </div>
                      <div className="flex items-center mt-1">
                        <Star size={14} className="text-accent mr-1" />
                        <span className="text-accent font-mono font-bold text-sm">
                          {item.owner.rating?.toFixed(1) || '5.0'} RATING
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-steel">
                    <Shield size={16} className="mr-2 text-primary" />
                    <span className="font-display font-bold uppercase tracking-wide text-sm">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Booking */}
          <div>
            <Card className="sticky top-24">
              <h2 className="text-2xl font-black text-pure-white mb-6 font-display uppercase">
                {isOwner ? 'YOUR LISTING' : 'BOOK THIS ITEM'}
              </h2>

              {isOwner ? (
                <div className="text-center py-8">
                  <User size={48} className="mx-auto mb-4 text-primary" />
                  <p className="text-steel font-display font-bold uppercase tracking-wide mb-6">
                    THIS IS YOUR LISTING
                  </p>
                  <Button onClick={() => navigate('/profile')} className="w-full">
                    MANAGE LISTING
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                      START DATE
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={today}
                      max={item.availability_end_date}
                      className="input-brutal w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                      END DATE
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || today}
                      max={item.availability_end_date}
                      className="input-brutal w-full"
                    />
                  </div>

                  {startDate && endDate && (
                    <div className="bg-charcoal border-2 border-primary p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                          DURATION
                        </span>
                        <span className="text-pure-white font-mono font-bold">
                          {calculateDays(startDate, endDate)} DAYS
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                          DAILY RATE
                        </span>
                        <span className="text-pure-white font-mono font-bold">
                          {formatPrice(item.price_per_day)}
                        </span>
                      </div>
                      <div className="divider-brutal my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-primary font-display font-bold uppercase tracking-wide">
                          TOTAL
                        </span>
                        <span className="text-primary font-mono font-black text-xl">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleBooking}
                    disabled={!startDate || !endDate || bookingLoading}
                    className="w-full"
                  >
                    {bookingLoading ? 'BOOKING...' : 'REQUEST BOOKING'}
                  </Button>

                  <div className="text-center">
                    <p className="text-steel font-display font-bold uppercase tracking-wide text-xs">
                      BOOKING REQUESTS ARE SUBJECT TO OWNER APPROVAL
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}