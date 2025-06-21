import React, { useState, useEffect } from 'react'
import { supabase, Review } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatDate } from '../lib/utils'
import { Star, User, Package, MessageSquare } from 'lucide-react'

export const ReviewsPage: React.FC = () => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received')

  useEffect(() => {
    if (user) {
      fetchReviews()
    }
  }, [user, activeTab])

  const fetchReviews = async () => {
    if (!user) return

    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(name, email),
          reviewee:users!reviews_reviewee_id_fkey(name, email),
          item:items(title, image_url)
        `)

      if (activeTab === 'received') {
        query = query.eq('reviewee_id', user.id)
      } else {
        query = query.eq('reviewer_id', user.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-accent fill-accent' : 'text-steel'}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            MY <span className="text-primary">REVIEWS</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            FEEDBACK AND RATINGS FROM THE COMMUNITY
          </p>
          <div className="divider-brutal mt-6" />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex glass-brutal border-2 border-steel">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-8 py-4 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 ${
                activeTab === 'received'
                  ? 'bg-primary text-pure-white'
                  : 'text-pure-white hover:text-primary'
              }`}
            >
              REVIEWS RECEIVED
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`px-8 py-4 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 ${
                activeTab === 'given'
                  ? 'bg-primary text-pure-white'
                  : 'text-pure-white hover:text-primary'
              }`}
            >
              REVIEWS GIVEN
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="loading-brutal h-32" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 border-4 border-steel flex items-center justify-center">
              <MessageSquare size={32} className="text-steel" />
            </div>
            <h3 className="text-2xl font-black text-pure-white mb-4 font-display">
              NO REVIEWS YET
            </h3>
            <p className="text-steel font-display font-bold uppercase tracking-wide mb-6">
              {activeTab === 'received' 
                ? 'COMPLETE SOME RENTALS TO RECEIVE REVIEWS'
                : 'RENT ITEMS TO LEAVE REVIEWS FOR OTHERS'
              }
            </p>
            <Button onClick={() => window.location.href = '/browse'}>
              BROWSE ITEMS
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Item Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-steel/20 flex-shrink-0 overflow-hidden">
                      {review.item?.image_url ? (
                        <img
                          src={review.item.image_url}
                          alt={review.item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-steel" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-black text-pure-white mb-2 font-display uppercase">
                        {review.item?.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <User size={14} className="mr-2 text-steel" />
                          <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                            {activeTab === 'received' 
                              ? `FROM ${review.reviewer?.name}` 
                              : `TO ${review.reviewee?.name}`
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        
                        <span className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                          {formatDate(review.created_at)}
                        </span>
                      </div>

                      {review.comment && (
                        <div className="bg-charcoal border-l-4 border-primary p-4 mt-4">
                          <p className="text-concrete font-display font-medium leading-relaxed">
                            "{review.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating Display */}
                  <div className="text-center lg:w-24">
                    <div className="text-4xl font-black text-primary font-mono mb-2">
                      {review.rating}.0
                    </div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <div className="text-steel font-display font-bold uppercase tracking-wide text-xs">
                      RATING
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )