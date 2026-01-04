-- Create listening_progress table to track user's listening progress
-- This table stores progress for each chapter of an audiobook

CREATE TABLE IF NOT EXISTS "maqal-book".listening_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "maqal-book".users(id) ON DELETE CASCADE,
  audiobook_id UUID NOT NULL REFERENCES "maqal-book".audiobooks(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  current_time_seconds INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, audiobook_id, chapter_number)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_listening_progress_user_id ON "maqal-book".listening_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_listening_progress_audiobook_id ON "maqal-book".listening_progress(audiobook_id);
CREATE INDEX IF NOT EXISTS idx_listening_progress_user_audiobook ON "maqal-book".listening_progress(user_id, audiobook_id);
CREATE INDEX IF NOT EXISTS idx_listening_progress_updated_at ON "maqal-book".listening_progress(updated_at DESC);

-- Function to update updated_at timestamp
CREATE TRIGGER update_listening_progress_updated_at
  BEFORE UPDATE ON "maqal-book".listening_progress
  FOR EACH ROW
  EXECUTE FUNCTION "maqal-book".update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE "maqal-book".listening_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON "maqal-book".listening_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON "maqal-book".listening_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON "maqal-book".listening_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own progress
CREATE POLICY "Users can delete own progress"
  ON "maqal-book".listening_progress
  FOR DELETE
  USING (auth.uid() = user_id);


