-- Add avatar_url column to customers table in maqal-book schema
-- This allows customers to have profile avatars

ALTER TABLE "maqal-book".customers 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for faster queries (optional, but helpful if searching by avatar_url)
CREATE INDEX IF NOT EXISTS idx_customers_avatar_url ON "maqal-book".customers(avatar_url) WHERE avatar_url IS NOT NULL;
