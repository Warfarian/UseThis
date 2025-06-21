/*
  # Chat and Inquiry System

  1. New Tables
    - `conversations` - Chat conversations between users
    - `messages` - Individual messages in conversations
    - `inquiries` - Formal inquiries about items

  2. Security
    - Enable RLS on all tables
    - Users can only see their own conversations
    - Proper access control for messages

  3. Features
    - Real-time messaging capability
    - Item-specific inquiries
    - Conversation management
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_2_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_conversation CHECK (participant_1_id != participant_2_id),
  CONSTRAINT unique_conversation UNIQUE (participant_1_id, participant_2_id, item_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'inquiry', 'booking_request')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create inquiries table for formal item inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  inquirer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'responded', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can read their conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Messages policies
CREATE POLICY "Users can read messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE auth.uid() = participant_1_id OR auth.uid() = participant_2_id
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE auth.uid() = participant_1_id OR auth.uid() = participant_2_id
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Inquiries policies
CREATE POLICY "Users can read their inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = inquirer_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create inquiries"
  ON inquiries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inquirer_id);

CREATE POLICY "Owners can update inquiry status"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_item ON conversations(item_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_item ON inquiries(item_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_inquirer ON inquiries(inquirer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_owner ON inquiries(owner_id);

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp when message is sent
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Add updated_at trigger for inquiries
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();