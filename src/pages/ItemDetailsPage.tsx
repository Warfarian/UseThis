import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, Item, Review } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatPrice, formatDate, calculateDays } from '../lib/utils'
import { ArrowLeft, MapPin, Calendar, Star, User, Shield, Clock, MessageSquare, CreditCard, AlertCircle } from 'lucide-react'

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState<Item | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'confirmation'>('details')

  useEffect(() => {
    if (id) {
      fetchItem()
      fetchReviews()
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

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(name)
        `)
        .eq('item_id', id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
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
          status: 'pending' // Always starts as pending for owner approval
        })

      if (error) throw error

      setCheckoutStep('confirmation')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const startConversation = async () => {
    if (!user || !item) return

    try {
      // Check if conversation already exists
      const { data: existingConv, error: searchError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${item.owner_id}),and(participant_1_id.eq.${item.owner_id},participant_2_id.eq.${user.id})`)
        .eq('item_id', item.id)
        .maybeSingle()

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError
      }

      let conversationId = existingConv?.id

      if (!conversationId) {
        // Create new conversation
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            participant_1_id: user.id,
            participant_2_id: item.owner_id,
            item_id: item.id
          })
          .select('id')
          .single()

        if (convError) {
          console.error('Conversation creation error:', convError)
          throw new Error('Failed to create conversation. Please try again.')
        }
        conversationId = newConv.id

        // Send initial message
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: `Hi! I'm interested in your item "${item.title}". Can we chat about it?`,
            message_type: 'inquiry'
          })

        if (messageError) {
          console.error('Message creation error:', messageError)
          throw new Error('Failed to send initial message. Please try again.')
        }
      }

      // Redirect to messages
      navigate('/messages')
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert(error instanceof Error ? error.message : 'Failed to start conversation. Please try again.')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-accent fill-accent' : 'text-steel'}
      />
    ))
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : (item?.owner?.rating || 5.0)

  // Get today's date and max date (1 year from now)
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  const maxDateString = maxDate.toISOString().split('T')[0]

  // Calculate booking details
  const bookingDays = startDate && endDate ? calculateDays(startDate, endDate) : 0
  const serviceFee = totalPrice * 0.1 // 10% service fee
  const finalTotal = totalPrice + serviceFee

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
        <div className="max-w-4xl mx-auto">
          <Card className="loading-brutal h-96">
            <></>
          </Card>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
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

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
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
              <h1 className="text-2xl sm:text-3xl font-black text-pure-white mb-4 font-display uppercase">
                {item.title}
              </h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-primary font-black text-xl sm:text-2xl font-mono">
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
              <Card className="mb-6">
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

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-pure-white font-display uppercase">
                    REVIEWS ({reviews.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="text-accent font-mono font-bold">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-pure-white font-display font-bold uppercase tracking-wide text-sm">
                            {review.reviewer?.name}
                          </span>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-steel font-display font-bold uppercase tracking-wide text-xs">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-concrete font-display font-medium text-sm">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Booking */}
          <div>
            <Card className="sticky top-32">
              {!showCheckout ? (
                <>
                  <h2 className="text-xl sm:text-2xl font-black text-pure-white mb-6 font-display uppercase">
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
                          max={item.availability_end_date < maxDateString ? item.availability_end_date : maxDateString}
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
                          max={item.availability_end_date < maxDateString ? item.availability_end_date : maxDateString}
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
                              {bookingDays} {bookingDays === 1 ? 'DAY' : 'DAYS'}
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
                              SUBTOTAL
                            </span>
                            <span className="text-primary font-mono font-black text-xl">
                              {formatPrice(totalPrice)}
                            </span>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => setShowCheckout(true)}
                        disabled={!startDate || !endDate}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <CreditCard size={16} />
                        <span>REQUEST BOOKING</span>
                      </Button>

                      <div className="divider-brutal" />

                      {/* Single Communication Option */}
                      <Button
                        variant="outline"
                        onClick={startConversation}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <MessageSquare size={16} />
                        <span>MESSAGE OWNER</span>
                      </Button>

                      <div className="text-center">
                        <p className="text-steel font-display font-bold uppercase tracking-wide text-xs">
                          BOOKING REQUESTS REQUIRE OWNER APPROVAL
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Checkout Flow */
                <div>
                  {checkoutStep === 'details' && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-pure-white font-display uppercase">
                          BOOKING REQUEST
                        </h2>
                        <button
                          onClick={() => setShowCheckout(false)}
                          className="text-steel hover:text-primary transition-colors"
                        >
                          <ArrowLeft size={20} />
                        </button>
                      </div>

                      {/* Booking Summary */}
                      <div className="bg-charcoal border-2 border-steel p-4 mb-6">
                        <h3 className="text-lg font-black text-pure-white mb-4 font-display uppercase">
                          BOOKING SUMMARY
                        </h3>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-steel font-display font-bold uppercase">ITEM</span>
                            <span className="text-pure-white font-display font-medium">{item.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-steel font-display font-bold uppercase">DATES</span>
                            <span className="text-pure-white font-display font-medium">
                              {formatDate(startDate)} - {formatDate(endDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-steel font-display font-bold uppercase">DURATION</span>
                            <span className="text-pure-white font-display font-medium">
                              {bookingDays} {bookingDays === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="bg-charcoal border-2 border-primary p-4 mb-6">
                        <h3 className="text-lg font-black text-pure-white mb-4 font-display uppercase">
                          PRICE BREAKDOWN
                        </h3>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-steel font-display font-bold uppercase">
                              {formatPrice(item.price_per_day)} × {bookingDays} {bookingDays === 1 ? 'day' : 'days'}
                            </span>
                            <span className="text-pure-white font-mono font-bold">{formatPrice(totalPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-steel font-display font-bold uppercase">SERVICE FEE</span>
                            <span className="text-pure-white font-mono font-bold">{formatPrice(serviceFee)}</span>
                          </div>
                          <div className="divider-brutal my-3" />
                          <div className="flex justify-between">
                            <span className="text-primary font-display font-bold uppercase text-base">TOTAL</span>
                            <span className="text-primary font-mono font-black text-xl">{formatPrice(finalTotal)}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setCheckoutStep('payment')}
                        className="w-full"
                      >
                        CONTINUE TO PAYMENT
                      </Button>
                    </>
                  )}

                  {checkoutStep === 'payment' && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-pure-white font-display uppercase">
                          PAYMENT INFO
                        </h2>
                        <button
                          onClick={() => setCheckoutStep('details')}
                          className="text-steel hover:text-primary transition-colors"
                        >
                          <ArrowLeft size={20} />
                        </button>
                      </div>

                      {/* Important Notice */}
                      <div className="bg-accent/20 border-2 border-accent p-4 mb-6">
                        <div className="flex items-start space-x-3">
                          <AlertCircle size={20} className="text-accent flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-accent font-display font-bold uppercase text-sm mb-2">
                              PAYMENT AUTHORIZATION
                            </h4>
                            <p className="text-concrete font-display font-medium text-sm leading-relaxed">
                              Your payment method will be authorized but <strong>not charged</strong> until the owner approves your booking request.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Demo Payment Form */}
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                            CARD NUMBER
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="input-brutal w-full"
                            defaultValue="4242 4242 4242 4242"
                            readOnly
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                              EXPIRY
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="input-brutal w-full"
                              defaultValue="12/28"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                              CVC
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="input-brutal w-full"
                              defaultValue="123"
                              readOnly
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                            CARDHOLDER NAME
                          </label>
                          <input
                            type="text"
                            placeholder="JOHN DOE"
                            className="input-brutal w-full"
                            defaultValue={user?.email?.split('@')[0].toUpperCase() || 'DEMO USER'}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Total Display */}
                      <div className="bg-charcoal border-2 border-primary p-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-display font-bold uppercase">
                            AUTHORIZATION AMOUNT
                          </span>
                          <span className="text-primary font-mono font-black text-2xl">
                            {formatPrice(finalTotal)}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={handleBooking}
                        disabled={bookingLoading}
                        className="w-full"
                      >
                        {bookingLoading ? 'PROCESSING...' : 'SUBMIT BOOKING REQUEST'}
                      </Button>

                      <div className="text-center mt-4">
                        <p className="text-steel font-display font-bold uppercase tracking-wide text-xs">
                          🔒 DEMO MODE - NO ACTUAL PAYMENT WILL BE CHARGED
                        </p>
                      </div>
                    </>
                  )}

                  {checkoutStep === 'confirmation' && (
                    <>
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                          <Clock size={32} className="text-pure-white" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-pure-white mb-4 font-display uppercase">
                          REQUEST SUBMITTED!
                        </h2>
                        
                        <p className="text-steel font-display font-bold uppercase tracking-wide mb-6">
                          YOUR BOOKING REQUEST IS PENDING OWNER APPROVAL
                        </p>

                        <div className="bg-charcoal border-2 border-accent p-4 mb-6 text-left">
                          <h3 className="text-lg font-black text-pure-white mb-3 font-display uppercase">
                            REQUEST DETAILS
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-steel font-display font-bold uppercase">ITEM</span>
                              <span className="text-pure-white font-display font-medium">{item.title}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-steel font-display font-bold uppercase">DATES</span>
                              <span className="text-pure-white font-display font-medium">
                                {formatDate(startDate)} - {formatDate(endDate)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-steel font-display font-bold uppercase">TOTAL</span>
                              <span className="text-primary font-mono font-bold">{formatPrice(finalTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-steel font-display font-bold uppercase">STATUS</span>
                              <span className="text-accent font-display font-bold uppercase">PENDING APPROVAL</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-accent/20 border-2 border-accent p-4 mb-6">
                          <div className="flex items-start space-x-3">
                            <AlertCircle size={16} className="text-accent flex-shrink-0 mt-1" />
                            <div className="text-left">
                              <h4 className="text-accent font-display font-bold uppercase text-sm mb-2">
                                WHAT HAPPENS NEXT?
                              </h4>
                              <ul className="text-concrete font-display font-medium text-sm space-y-1">
                                <li>• The owner will review your request</li>
                                <li>• You'll be notified of their decision</li>
                                <li>• Payment will only be charged if approved</li>
                                <li>• You can track status in "My Bookings"</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Button onClick={() => navigate('/bookings')} className="w-full">
                            VIEW MY BOOKINGS
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/browse')} 
                            className="w-full"
                          >
                            CONTINUE BROWSING
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}