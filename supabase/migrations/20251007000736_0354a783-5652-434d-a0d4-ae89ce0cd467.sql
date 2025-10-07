-- Add theme column to couples table
ALTER TABLE couples ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'default' CHECK (theme IN ('default', 'feminine', 'masculine'));