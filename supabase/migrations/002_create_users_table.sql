-- Create users table in maqal-book schema
-- This table extends the auth.users table with additional profile information

CREATE TABLE IF NOT EXISTS "maqal-book".users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  listening_time_minutes INTEGER DEFAULT 0,
  books_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Explorer',
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON "maqal-book".users(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON "maqal-book".users(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION "maqal-book".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON "maqal-book".users
  FOR EACH ROW
  EXECUTE FUNCTION "maqal-book".update_updated_at_column();

-- Function to automatically create user profile when a user signs up
CREATE OR REPLACE FUNCTION "maqal-book".handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "maqal-book".users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION "maqal-book".handle_new_user();

-- Enable Row Level Security
ALTER TABLE "maqal-book".users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON "maqal-book".users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON "maqal-book".users
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Public profiles can be viewed by authenticated users
-- (for features like leaderboards, etc.)
CREATE POLICY "Authenticated users can view public profiles"
  ON "maqal-book".users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can insert (via trigger)
CREATE POLICY "Authenticated users can insert profiles"
  ON "maqal-book".users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

