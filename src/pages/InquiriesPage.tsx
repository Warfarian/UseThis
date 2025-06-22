import React, { useState, useEffect } from 'react'
import { supabase, Inquiry } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatDate } from '../lib/utils'
import { MessageSquare, Package, User, Send, CheckCircle, Clock, XCircle } from 'lucide-react'

export const InquiriesPage: React.FC = () => {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const [replyModal, setReplyModal] = useState<Inquiry | null>(null)
  const [replyMessage, setReplyMessage] = useState('')

  useEffect(() => {
    if (user) {
      fetchInquiries()
    }
  }, [user, activeTab])

  const fetchInquiries = async () => {
    if (!user) return

    try {
      let query = supabase
        .from('inquiries')
        .select(`
          *,
          item:items(id, title, image_url),
          inquirer:users!inquiries_inquirer_id_fkey(id, name, email),
          owner:users!inquiries_owner_id_fkey(id, name, email)
        `)

      if (activeTab === 'received') {
        query = query.eq('owner_id', user.id)
      } else {
        query = query.eq('inquirer_id', user.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setInquiries(data || [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', inquiryId)

      if (error) throw error
      fetchInquiries()
    } catch (error) {
      console.error('Error updating inquiry status:', error)
    }
  }

  const startConversation = async (inquiry: Inquiry) => {
    if (!user) return

    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${inquiry.inquirer_id}),and(participant_1_id.eq.${inquiry.inquirer_id},participant_2_id.eq.${user.id})`)
        .eq('item_id', inquiry.item_id)
        .single()

      let conversationId = existingConv?.id

      if (!conversationId) {
        // Create new conversation
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            participant_1_id: user.id,
            participant_2_id: inquiry.inquirer_id,
            item_id: inquiry.item_id
          })
          .select('id')
          .single()

        if (convError) throw convError
        conversationId = newConv.id
      }

      // Send initial message with inquiry details
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: `Hi! I'm responding to your inquiry about "${inquiry.item?.title}". ${replyMessage}`,
          message_type: 'inquiry'
        })

      if (messageError) throw messageError

      // Update inquiry status
      await updateInquiryStatus(inquiry.id, 'responded')
      setReplyModal(null)
      setReplyMessage('')
      
      // Redirect to messages
      window.location.href = '/messages'
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert('Failed to start conversation. Please try again.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded':
        return <CheckCircle size={16} className="text-primary" />
      case 'closed':
        return <XCircle size={16} className="text-steel" />
      default:
        return <Clock size={16} className="text-accent" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded':
        return 'text-primary'
      case 'closed':
        return 'text-steel'
      default:
        return 'text-accent'
    }
  }

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            MY <span className="text-primary">INQUIRIES</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            MANAGE ITEM INQUIRIES AND QUESTIONS
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
              RECEIVED INQUIRIES
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-8 py-4 font-bold font-display text-sm uppercase tracking-wide transition-all duration-100 ${
                activeTab === 'sent'
                  ? 'bg-primary text-pure-white'
                  : 'text-pure-white hover:text-primary'
              }`}
            >
              SENT INQUIRIES
            </button>
          </div>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="loading-brutal h-32">
                <></>
              </Card>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 border-4 border-steel flex items-center justify-center">
              <MessageSquare size={32} className="text-steel" />
            </div>
            <h3 className="text-2xl font-black text-pure-white mb-4 font-display">
              NO INQUIRIES YET
            </h3>
            <p className="text-steel font-display font-bold uppercase tracking-wide mb-6">
              {activeTab === 'received' 
                ? 'WHEN STUDENTS ASK ABOUT YOUR ITEMS, THEY\'LL APPEAR HERE'
                : 'START BROWSING TO ASK QUESTIONS ABOUT ITEMS'
              }
            </p>
            <Button onClick={() => window.location.href = '/browse'}>
              BROWSE ITEMS
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Side - Inquiry Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-20 h-20 bg-steel/20 flex-shrink-0 overflow-hidden">
                      {inquiry.item?.image_url ? (
                        <img
                          src={inquiry.item.image_url}
                          alt={inquiry.item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={24} className="text-steel" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-black text-pure-white font-display uppercase">
                          {inquiry.subject}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(inquiry.status)}
                          <span className={`font-display font-bold uppercase tracking-wide text-sm ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-3 text-steel text-sm">
                        <div className="flex items-center">
                          <Package size={14} className="mr-2" />
                          <span className="font-display font-bold uppercase tracking-wide">
                            {inquiry.item?.title}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <User size={14} className="mr-2" />
                          <span className="font-display font-bold uppercase tracking-wide">
                            {activeTab === 'received' ? inquiry.inquirer?.name : inquiry.owner?.name}
                          </span>
                        </div>
                        
                        <span className="font-display font-bold uppercase tracking-wide">
                          {formatDate(inquiry.created_at)}
                        </span>
                      </div>

                      <div className="bg-charcoal border-l-4 border-primary p-4">
                        <p className="text-concrete font-display font-medium leading-relaxed">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  {activeTab === 'received' && inquiry.status === 'open' && (
                    <div className="flex flex-col gap-3 lg:w-48">
                      <Button
                        size="sm"
                        onClick={() => setReplyModal(inquiry)}
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <Send size={14} />
                        <span>REPLY</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateInquiryStatus(inquiry.id, 'closed')}
                        className="w-full"
                      >
                        CLOSE
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Reply Modal */}
        {replyModal && (
          <div className="fixed inset-0 bg-pure-black/80 flex items-center justify-center z-50 p-6">
            <Card className="w-full max-w-2xl p-6">
              <h3 className="text-xl font-black text-pure-white mb-4 font-display uppercase">
                REPLY TO INQUIRY
              </h3>
              
              <div className="mb-4 p-4 bg-charcoal border-l-4 border-primary">
                <p className="text-steel font-display font-bold uppercase tracking-wide text-sm mb-2">
                  ORIGINAL MESSAGE:
                </p>
                <p className="text-concrete font-display font-medium">
                  {replyModal.message}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
                  YOUR REPLY
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="TYPE YOUR RESPONSE..."
                  rows={4}
                  className="input-brutal w-full resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => startConversation(replyModal)} 
                  className="flex-1"
                  disabled={!replyMessage.trim()}
                >
                  START CONVERSATION
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setReplyModal(null)
                    setReplyMessage('')
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