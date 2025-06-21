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