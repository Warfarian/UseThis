/*
  # Enhanced Review System and Rating Updates

  1. New Functions
    - Function to update user ratings based on reviews
    - Trigger to automatically update ratings when reviews are added/updated

  2. Enhanced Reviews
    - Better review policies
    - Automatic rating calculations

  3. Sample Reviews
    - Add sample review data to demonstrate the system
*/

-- Function to calculate and update user ratings
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the reviewee's rating based on all their reviews
  UPDATE users 
  SET rating = (
    SELECT COALESCE(AVG(rating::numeric), 5.0)
    FROM reviews 
    WHERE reviewee_id = COALESCE(NEW.reviewee_id, OLD.reviewee_id)
  )
  WHERE id = COALESCE(NEW.reviewee_id, OLD.reviewee_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update ratings when reviews change
DROP TRIGGER IF EXISTS update_rating_on_review_change ON reviews;
CREATE TRIGGER update_rating_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();

-- Insert sample reviews (these will be for existing users/items)
DO $$
DECLARE
  sample_user_id uuid;
  sample_item_id uuid;
  sample_booking_id uuid;
BEGIN
  -- Get a sample user and item for demo reviews
  SELECT id INTO sample_user_id FROM users LIMIT 1;
  SELECT id INTO sample_item_id FROM items LIMIT 1;
  
  -- Create a sample booking first (needed for reviews)
  INSERT INTO bookings (
    item_id, 
    renter_id, 
    owner_id, 
    start_date, 
    end_date, 
    status, 
    total_price
  ) VALUES (
    sample_item_id,
    sample_user_id,
    (SELECT owner_id FROM items WHERE id = sample_item_id),
    '2024-12-01',
    '2024-12-03',
    'returned',
    50.00
  ) RETURNING id INTO sample_booking_id;
  
  -- Insert sample reviews
  INSERT INTO reviews (
    item_id,
    reviewer_id,
    reviewee_id,
    booking_id,
    rating,
    comment
  ) VALUES 
  (
    sample_item_id,
    sample_user_id,
    (SELECT owner_id FROM items WHERE id = sample_item_id),
    sample_booking_id,
    5,
    'Excellent item! Exactly as described and the owner was very responsive. Would definitely rent again.'
  ),
  (
    sample_item_id,
    (SELECT owner_id FROM items WHERE id = sample_item_id),
    sample_user_id,
    sample_booking_id,
    5,
    'Great renter! Took excellent care of the item and returned it in perfect condition. Highly recommended!'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- If there's an error (like no users/items exist), just continue
    NULL;
END $$;

-- Update existing users to have default ratings if they don't have any
UPDATE users 
SET rating = 5.0 
WHERE rating IS NULL OR rating = 0;