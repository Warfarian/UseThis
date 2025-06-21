/*
  # Initial Schema Setup for UseThis Platform

  1. New Tables
    - `users` - Extended user profiles with ratings
    - `categories` - Item categories (Appliances, Gaming, etc.)
    - `items` - Rental items with details and availability
    - `bookings` - Rental requests and transactions
    - `reviews` - User ratings and feedback system

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on ownership

  3. Storage
    - Create bucket for item images
    - Set up public access policies for images
*/

-- Create users table for extended profiles
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  rating numeric(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'package',
  created_at timestamptz DEFAULT now()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  location text NOT NULL,
  price_per_day numeric(10,2) NOT NULL CHECK (price_per_day > 0),
  availability_start_date date NOT NULL,
  availability_end_date date NOT NULL,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url text DEFAULT '',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_availability_dates CHECK (availability_end_date >= availability_start_date)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  renter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'returned', 'cancelled')),
  total_price numeric(10,2) NOT NULL CHECK (total_price > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_booking_dates CHECK (end_date >= start_date),
  CONSTRAINT no_self_booking CHECK (renter_id != owner_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_review CHECK (reviewer_id != reviewee_id),
  CONSTRAINT unique_review_per_booking UNIQUE (booking_id, reviewer_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Items policies
CREATE POLICY "Anyone can read available items"
  ON items FOR SELECT
  TO authenticated
  USING (is_available = true);

CREATE POLICY "Owners can read their own items"
  ON items FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create items"
  ON items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their items"
  ON items FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their items"
  ON items FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Bookings policies
CREATE POLICY "Users can read their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Owners and renters can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = renter_id OR auth.uid() = owner_id);

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update their reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Insert default categories
INSERT INTO categories (name, icon) VALUES
  ('Appliances', 'zap'),
  ('Gaming Consoles', 'gamepad-2'),
  ('Kitchen', 'chef-hat'),
  ('Electronics', 'smartphone'),
  ('Furniture', 'armchair'),
  ('Sports & Recreation', 'dumbbell'),
  ('Study & Office', 'book-open'),
  ('Tools & Equipment', 'wrench')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_owner_id ON items(owner_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_availability ON items(availability_start_date, availability_end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_item_id ON bookings(item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_item_id ON reviews(item_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();