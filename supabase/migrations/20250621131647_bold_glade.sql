/*
  # Seed Sample Data for UseThis Platform

  1. Sample Categories
    - Electronics, Gaming, Kitchen, Sports, Books, Tools
  
  2. Sample Items
    - Various items across different categories with realistic data
    - Proper pricing and availability dates
    - Sample image URLs from Pexels
  
  3. Sample Bookings
    - Different booking statuses to demonstrate the platform
*/

-- Insert sample categories
INSERT INTO categories (name, icon) VALUES
  ('Electronics', 'zap'),
  ('Gaming', 'gamepad-2'),
  ('Kitchen', 'chef-hat'),
  ('Sports', 'activity'),
  ('Books', 'book'),
  ('Tools', 'wrench')
ON CONFLICT (name) DO NOTHING;

-- Insert sample items (using placeholder user IDs - these will need to be updated with real user IDs)
INSERT INTO items (
  title, 
  description, 
  category, 
  location, 
  price_per_day, 
  availability_start_date, 
  availability_end_date, 
  owner_id, 
  image_url,
  is_available
) VALUES
  (
    'MacBook Pro 16" M2',
    'Perfect for coding, design work, or video editing. Excellent condition with charger included. Great for students who need powerful computing for projects.',
    'Electronics',
    'Stanford Campus',
    25.00,
    '2025-01-01',
    '2025-06-30',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    true
  ),
  (
    'PlayStation 5 Console',
    'Latest PS5 with two controllers and popular games included. Perfect for gaming sessions with friends or solo adventures.',
    'Gaming',
    'MIT Dorms',
    20.00,
    '2025-01-01',
    '2025-05-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg',
    true
  ),
  (
    'KitchenAid Stand Mixer',
    'Professional-grade stand mixer perfect for baking projects, meal prep, or cooking for events. Includes multiple attachments.',
    'Kitchen',
    'Harvard Square',
    15.00,
    '2025-01-01',
    '2025-12-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    true
  ),
  (
    'Canon EOS R6 Camera',
    'Professional mirrorless camera with lens kit. Perfect for photography projects, events, or content creation. Includes memory cards.',
    'Electronics',
    'UC Berkeley',
    30.00,
    '2025-01-01',
    '2025-08-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
    true
  ),
  (
    'Nintendo Switch OLED',
    'Latest Nintendo Switch with OLED screen. Includes popular games like Mario Kart and Zelda. Great for portable gaming.',
    'Gaming',
    'UCLA Campus',
    18.00,
    '2025-01-01',
    '2025-07-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg',
    true
  ),
  (
    'Instant Pot Duo 8Qt',
    'Large capacity pressure cooker perfect for meal prep, cooking for groups, or making quick healthy meals. Includes recipe book.',
    'Kitchen',
    'NYU Dorms',
    12.00,
    '2025-01-01',
    '2025-12-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg',
    true
  ),
  (
    'iPad Pro 12.9" with Apple Pencil',
    'Latest iPad Pro with Apple Pencil and keyboard case. Perfect for digital art, note-taking, or presentations.',
    'Electronics',
    'Columbia University',
    22.00,
    '2025-01-01',
    '2025-06-30',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
    true
  ),
  (
    'Dyson V15 Vacuum',
    'Powerful cordless vacuum perfect for dorm cleaning or apartment maintenance. Lightweight and easy to use.',
    'Tools',
    'Princeton Campus',
    10.00,
    '2025-01-01',
    '2025-12-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/4107120/pexels-photo-4107120.jpeg',
    true
  ),
  (
    'Textbook Bundle - Computer Science',
    'Complete set of CS textbooks including algorithms, data structures, and programming languages. Save hundreds on textbook costs.',
    'Books',
    'Carnegie Mellon',
    8.00,
    '2025-01-01',
    '2025-05-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    true
  ),
  (
    'Professional Drill Set',
    'Complete drill set with bits and accessories. Perfect for furniture assembly, dorm setup, or DIY projects.',
    'Tools',
    'Georgia Tech',
    14.00,
    '2025-01-01',
    '2025-12-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/162553/tools-construct-craft-repair-162553.jpeg',
    true
  ),
  (
    'Skateboard - Complete Setup',
    'High-quality skateboard perfect for campus transportation or learning tricks. Includes safety gear.',
    'Sports',
    'UCSD Campus',
    16.00,
    '2025-01-01',
    '2025-08-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/1374064/pexels-photo-1374064.jpeg',
    true
  ),
  (
    'Espresso Machine - Breville',
    'Professional espresso machine for coffee lovers. Make cafe-quality drinks in your dorm or apartment.',
    'Kitchen',
    'University of Chicago',
    20.00,
    '2025-01-01',
    '2025-12-31',
    (SELECT id FROM auth.users LIMIT 1),
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    true
  );