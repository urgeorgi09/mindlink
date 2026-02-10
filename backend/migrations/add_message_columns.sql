-- Migration script to add is_read and is_important columns to messages table

ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_important BOOLEAN DEFAULT false;
