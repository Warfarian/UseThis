import React, { useState, useEffect } from 'react'
import { supabase, Booking } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatPrice, formatDate } from '../lib/utils'
import { Calendar, Clock, User, Package, CheckCircle, XCircle, AlertCircle, Star, Plus, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

export const BookingsPage: React.FC = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'renter' | 'owner'>('renter')
  const [reviewModal, setReviewModal] = useState<{ booking: Booking; type: 'item' | 'user' } | null>(null)
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user, activeTab])

  const fetchBookings = async () => {
    if (!user) return

    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          item:items(title, image_url, price_per_day),
          renter:users!bookings_renter_id_fkey(name, email),
          owner:users!bookings_owner_id_fkey(name, email)
        `)

      if (activeTab === 'renter') {
        query = query.eq('renter_id', user.id)
      } else {
        query = query.eq('owner_id', user.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

      if (error) throw error
      
      fetchBookings()
      
      // Show appropriate message based on action
      if (status === 'confirmed') {
        alert('Booking approved! The renter has been notified.')
      } else if (status === 'cancelled') {
        alert('Booking declined. The renter has been notified.')
      } else {
        alert(`Booking ${status} successfully!`)
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking. Please try again.')
    }
  }

  const submitReview = async () => {
    if (!reviewModal || !user) return

    try {
      const { booking, type } = reviewModal
      
      const reviewData_final = {
        item_id: booking.item?.id || booking.item_id,
        reviewer_id: user.id,
        reviewee_id: type === 'item' 
          ? booking.owner_id 
          : (activeTab === 'renter' ? booking.owner_id : booking.renter_id),
        booking_id: booking.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      }

      const { error } = await supabase
        .from('reviews')
        .insert(reviewData_final)

      if (error) throw error

      alert('Review submitted successfully!')
      setReviewModal(null)
      setReviewData({ rating: 5, comment: '' })
      fetchBookings()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} className="text-primary" />
      case 'cancelled':
        return <XCircle size={20} className="text-crimson" />
      case 'active':
        return <Clock size={20} className="text-accent" />
      case 'returned':
        return <CheckCircle size={20} className="text-secondary" />
      case 'pending':
        return <AlertCircle size={20} className="text-accent" />
      default:
        return <AlertCircle size={20} className="text-steel" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-primary'
      case 'cancelled':
        return 'text-crimson'
      case 'active':
        return 'text-accent'
      case 'returned':
        return 'text-secondary'
      case 'pending':
        return 'text-accent'
      default:
        return 'text-steel'
    }
  }

  const getStatusText = (status: string, isOwner: boolean) => {
    switch (status) {
      case 'pending':
        return isOwner ? 'AWAITING YOUR APPROVAL' : 'PENDING APPROVAL'
      case 'confirmed':
        return 'APPROVED'
      case 'cancelled':
        return 'DECLINED'
      case 'active':
        return 'ACTIVE RENTAL'
      case 'returned':
        return 'COMPLETED'
      default:
        return status.toUpperCase()
    }
  }

  const canReview = (booking: Booking) => {
    return booking.status === 'returned'
  }

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            MY <span className="text-primary">BOOKINGS</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            MANAGE YOUR RENTAL ACTIVITY
          </p>
          <div className="divider-brutal mt-6" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link to="/profile">
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye size={16} />
              <span>VIEW MY LISTINGS</span>
            </Button>
          </Link>
          <Link to="/add-listing">
            <Button variant="outline" className="flex items-center space-x-2">
              <Plus size={16} />
              <span>CREATE NEW LISTING</span>
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex glass-brutal border-2 border-steel">
            <button
              onClick={() => setActiveTab('renter')}
              className={`px-6 py-4 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 ${
                activeTab === 'renter'
                  ? 'bg-primary text-pure-white'
                  : 'text-pure-white hover:text-primary'
              }`}
            >
              MY RENTALS
              <div className="text-xs opacity-75 mt-1">Items I'm renting</div>
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`px-6 py-4 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 ${
                activeTab === 'owner'
                  ? 'bg-primary text-pure-white'
                  : 'text-pure-white hover:text-primary'
              }`}
            >
              RENTAL REQUESTS
              <div className="text-xs opacity-75 mt-1">People renting my items</div>
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="loading-brutal h-32" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 border-4 border-steel flex items-center justify-center">
              <Calendar size={32} className="text-steel" />
            </div>
            <h3 className="text-2xl font-black text-pure-white mb-4 font-display">
              NO BOOKINGS YET
            </h3>
            <p className="text-steel font-display font-bold uppercase tracking-wide mb-6">
              {activeTab === 'renter' 
                ? 'START BROWSING TO FIND ITEMS TO RENT'
                : 'YOUR ITEMS HAVEN\'T BEEN BOOKED YET'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {activeTab === 'renter' ? (
                <Link to="/browse">
                  <Button>BROWSE ITEMS</Button>
                </Link>
              ) : (
                <>
                  <Link to="/add-listing">
                    <Button className="flex items-center space-x-2">
                      <Plus size={16} />
                      <span>CREATE LISTING</span>
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Eye size={16} />
                      <span>VIEW MY LISTINGS</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left Side - Item Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-20 h-20 bg-steel/20 flex-shrink-0 overflow-hidden">
                      {booking.item?.image_url ? (
                        <img
                          src={booking.item.image_url}
                          alt={booking.item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={24} className="text-steel" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-black text-pure-white mb-2 font-display uppercase">
                        {booking.item?.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-steel text-sm">
                          <Calendar size={14} className="mr-2" />
                          <span className="font-display font-bold uppercase tracking-wide">
                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-steel text-sm">
                          <User size={14} className="mr-2" />
                          <span className="font-display font-bold uppercase tracking-wide">
                            {activeTab === 'renter' 
                              ? `OWNER: ${booking.owner?.name}` 
                              : `RENTER: ${booking.renter?.name}`
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className={`ml-2 font-display font-bold uppercase tracking-wide text-sm ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status, activeTab === 'owner')}
                          </span>
                        </div>
                        
                        <div className="text-primary font-black font-mono">
                          {formatPrice(booking.total_price)} TOTAL
                        </div>
                      </div>

                      {/* Status-specific messages */}
                      {booking.status === 'pending' && (
                        <div className="mt-3 p-3 bg-accent/20 border-l-4 border-accent">
                          <p className="text-accent font-display font-bold uppercase tracking-wide text-xs">
                            {activeTab === 'renter' 
                              ? '⏳ WAITING FOR OWNER TO APPROVE YOUR REQUEST'
                              : '👆 PLEASE REVIEW AND APPROVE/DECLINE THIS REQUEST'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
                    {activeTab === 'owner' && booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <CheckCircle size={14} />
                          <span>APPROVE</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="w-full flex items-center justify-center space-x-2"
                        >
                          <XCircle size={14} />
                          <span>DECLINE</span>
                        </Button>
                      </>
                    )}

                    {booking.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'active')}
                        className="w-full"
                      >
                        MARK ACTIVE
                      </Button>
                    )}

                    {booking.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'returned')}
                        className="w-full"
                      >
                        MARK RETURNED
                      </Button>
                    )}

                    {canReview(booking) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewModal({ booking, type: 'item' })}
                        className="w-full flex items-center justify-center space-x-1"
                      >
                        <Star size={14} />
                        <span>REVIEW</span>
                      </Button>
                    )}

                    <div className="text-center">
                      <p className="text-steel font-display font-bold uppercase tracking-wide text-xs">
                        REQUESTED {formatDate(booking.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {reviewModal && (
          <div className="fixed inset-0 bg-pure-black/80 flex items-center justify-center z-50 p-6">
            <Card className="w-full max-w-md p-6">
              <h3 className="text-xl font-black text-pure-white mb-4 font-display uppercase">
                LEAVE A REVIEW
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                  RATING
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className="text-2xl transition-colors"
                    >
                      <Star 
                        size={24} 
                        className={star <= reviewData.rating ? 'text-accent fill-accent' : 'text-steel'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                  COMMENT (OPTIONAL)
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="SHARE YOUR EXPERIENCE..."
                  rows={3}
                  className="input-brutal w-full resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={submitReview} className="flex-1">
                  SUBMIT REVIEW
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setReviewModal(null)
                    setReviewData({ rating: 5, comment: '' })
                  }}
                  className="flex-1"
                >
                  CANCEL
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}