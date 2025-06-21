import React, { useState, useEffect, useRef } from 'react'
import { supabase, Conversation, Message } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { formatDate } from '../lib/utils'
import { MessageSquare, Send, User, Package, ArrowLeft } from 'lucide-react'

export const MessagesPage: React.FC = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      markMessagesAsRead(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1:users!conversations_participant_1_id_fkey(id, name, email),
          participant_2:users!conversations_participant_2_id_fkey(id, name, email),
          item:items(id, title, image_url)
        `)
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

      if (error) throw error

      // Get unread message counts for each conversation
      const conversationsWithUnread = await Promise.all(
        (data || []).map(async (conv) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user.id)

          return { ...conv, unread_count: count || 0 }
        })
      )

      setConversations(conversationsWithUnread)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users(id, name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    setSendingMessage(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        })

      if (error) throw error

      setNewMessage('')
      fetchMessages(selectedConversation.id)
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participant_1_id === user?.id 
      ? conversation.participant_2 
      : conversation.participant_1
  }

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            MY <span className="text-primary">MESSAGES</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            CHAT WITH OTHER STUDENTS
          </p>
          <div className="divider-brutal mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full p-0 overflow-hidden">
              <div className="p-6 border-b-2 border-steel">
                <h2 className="text-xl font-black text-pure-white font-display uppercase">
                  CONVERSATIONS
                </h2>
              </div>
              
              <div className="overflow-y-auto h-full">
                {loading ? (
                  <div className="p-6">
                    <div className="loading-brutal h-20 mb-4" />
                    <div className="loading-brutal h-20 mb-4" />
                    <div className="loading-brutal h-20" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare size={32} className="mx-auto mb-4 text-steel" />
                    <p className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                      NO CONVERSATIONS YET
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const otherParticipant = getOtherParticipant(conversation)
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 border-b border-steel/30 cursor-pointer transition-colors hover:bg-charcoal/50 ${
                          selectedConversation?.id === conversation.id ? 'bg-charcoal' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary flex items-center justify-center flex-shrink-0">
                            <span className="text-pure-white font-bold text-sm">
                              {otherParticipant?.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-pure-white font-display font-bold uppercase tracking-wide text-sm truncate">
                                {otherParticipant?.name}
                              </h3>
                              {conversation.unread_count! > 0 && (
                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-pure-white text-xs font-bold">
                                    {conversation.unread_count}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {conversation.item && (
                              <div className="flex items-center text-steel text-xs mb-1">
                                <Package size={12} className="mr-1" />
                                <span className="truncate">{conversation.item.title}</span>
                              </div>
                            )}
                            
                            <p className="text-steel text-xs">
                              {formatDate(conversation.last_message_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full p-0 overflow-hidden flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b-2 border-steel flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden text-steel hover:text-primary"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    
                    <div className="w-12 h-12 bg-primary flex items-center justify-center">
                      <span className="text-pure-white font-bold">
                        {getOtherParticipant(selectedConversation)?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-black text-pure-white font-display uppercase">
                        {getOtherParticipant(selectedConversation)?.name}
                      </h2>
                      {selectedConversation.item && (
                        <div className="flex items-center text-steel text-sm">
                          <Package size={14} className="mr-2" />
                          <span className="font-display font-bold uppercase tracking-wide">
                            {selectedConversation.item.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-primary text-pure-white'
                              : 'bg-charcoal text-pure-white border-2 border-steel'
                          }`}
                        >
                          <p className="font-display font-medium text-sm leading-relaxed">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            message.sender_id === user?.id ? 'text-pure-white/70' : 'text-steel'
                          }`}>
                            {formatDate(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t-2 border-steel">
                    <div className="flex space-x-4">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="TYPE YOUR MESSAGE..."
                        rows={2}
                        className="input-brutal flex-1 resize-none"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className="flex items-center space-x-2"
                      >
                        <Send size={16} />
                        <span>SEND</span>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare size={48} className="mx-auto mb-4 text-steel" />
                    <h3 className="text-xl font-black text-pure-white mb-2 font-display">
                      SELECT A CONVERSATION
                    </h3>
                    <p className="text-steel font-display font-bold uppercase tracking-wide text-sm">
                      CHOOSE A CONVERSATION TO START CHATTING
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