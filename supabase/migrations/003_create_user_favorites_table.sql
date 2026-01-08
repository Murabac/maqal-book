-- Create user_favorites table to track user's favorite audiobooks
-- This table links users to their favorite audiobooks

CREATE TABLE IF NOT EXISTS "maqal-book".user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "maqal-book".users(id) ON DELETE CASCADE,
  audiobook_id UUID NOT NULL REFERENCES "maqal-book".audiobooks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, audiobook_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON "maqal-book".user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_audiobook_id ON "maqal-book".user_favorites(audiobook_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON "maqal-book".user_favorites(created_at DESC);

-- Enable Row Level Security
ALTER TABLE "maqal-book".user_favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON "maqal-book".user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can add their own favorites
CREATE POLICY "Users can add own favorites"
  ON "maqal-book".user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON "maqal-book".user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);






