import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  rating: number
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  title: string
  description: string
  category: string
  location: string
  price_per_day: number
  availability_start_date: string
  availability_end_date: string
  owner_id: string
  image_url: string
  created_at: string
  updated_at: string
  owner?: User
}

export interface Booking {
  id: string
  item_id: string
  renter_id: string
  owner_id: string
  start_date: string
  end_date: string
  status: 'pending' | 'confirmed' | 'active' | 'returned' | 'cancelled'
  total_price: number
  created_at: string
  updated_at: string
  item?: Item
  renter?: User
  owner?: User
}

export interface Review {
  id: string
  item_id: string
  reviewer_id: string
  reviewee_id: string
  booking_id: string
  rating: number
  comment: string
  created_at: string
  reviewer?: User
  reviewee?: User
  item?: Item
}

export interface Category {
  id: string
  name: string
  icon: string
  created_at: string
}

export interface Conversation {
  id: string
  participant_1_id: string
  participant_2_id: string
  item_id?: string
  last_message_at: string
  created_at: string
  participant_1?: User
  participant_2?: User
  item?: Item
  last_message?: Message
  unread_count?: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'inquiry' | 'booking_request'
  is_read: boolean
  created_at: string
  sender?: User
}

export interface Inquiry {
  id: string
  item_id: string
  inquirer_id: string
  owner_id: string
  subject: string
  message: string
  status: 'open' | 'responded' | 'closed'
  created_at: string
  updated_at: string
  item?: Item
  inquirer?: User
  owner?: User
}