-- Migration: Create normalized categories and authors tables
-- This migration normalizes the audiobooks schema by creating separate tables for categories and authors

-- Step 1: Create categories table in maqal-book schema
CREATE TABLE IF NOT EXISTS "maqal-book".categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create authors table in maqal-book schema
CREATE TABLE IF NOT EXISTS "maqal-book".authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Add author_id and category_id columns to maqal-book.audiobooks
-- First, check if the table exists in maqal-book schema, if not create it
CREATE TABLE IF NOT EXISTS "maqal-book".audiobooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  cover TEXT,
  duration TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'maqal-book' 
                 AND table_name = 'audiobooks' 
                 AND column_name = 'author_id') THEN
    ALTER TABLE "maqal-book".audiobooks ADD COLUMN author_id UUID REFERENCES "maqal-book".authors(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'maqal-book' 
                 AND table_name = 'audiobooks' 
                 AND column_name = 'category_id') THEN
    ALTER TABLE "maqal-book".audiobooks ADD COLUMN category_id UUID REFERENCES "maqal-book".categories(id);
  END IF;
END $$;

-- Step 4: Migrate existing data from public.audiobooks if it exists
-- Extract unique categories and authors from public.audiobooks and create records
INSERT INTO "maqal-book".categories (name)
SELECT DISTINCT category
FROM public.audiobooks
WHERE category IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO "maqal-book".authors (name)
SELECT DISTINCT author
FROM public.audiobooks
WHERE author IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Update maqal-book.audiobooks with category_id and author_id from public.audiobooks
-- Only if maqal-book.audiobooks doesn't have the data yet
DO $$
DECLARE
  book_record RECORD;
  author_uuid UUID;
  category_uuid UUID;
BEGIN
  FOR book_record IN 
    SELECT id, author, category FROM public.audiobooks
    WHERE EXISTS (SELECT 1 FROM "maqal-book".audiobooks WHERE "maqal-book".audiobooks.id = public.audiobooks.id)
  LOOP
    -- Get author_id
    SELECT id INTO author_uuid FROM "maqal-book".authors WHERE name = book_record.author LIMIT 1;
    -- Get category_id
    SELECT id INTO category_uuid FROM "maqal-book".categories WHERE name = book_record.category LIMIT 1;
    
    -- Update the audiobook
    UPDATE "maqal-book".audiobooks
    SET 
      author_id = author_uuid,
      category_id = category_uuid
    WHERE id = book_record.id;
  END LOOP;
END $$;

-- Step 5: Make category_id and author_id NOT NULL after migration
-- But first ensure all records have values
UPDATE "maqal-book".audiobooks
SET author_id = (SELECT id FROM "maqal-book".authors LIMIT 1)
WHERE author_id IS NULL AND EXISTS (SELECT 1 FROM "maqal-book".authors);

UPDATE "maqal-book".audiobooks
SET category_id = (SELECT id FROM "maqal-book".categories LIMIT 1)
WHERE category_id IS NULL AND EXISTS (SELECT 1 FROM "maqal-book".categories);

-- Now make them NOT NULL if needed (commented out for safety, uncomment if you're sure)
-- ALTER TABLE "maqal-book".audiobooks ALTER COLUMN author_id SET NOT NULL;
-- ALTER TABLE "maqal-book".audiobooks ALTER COLUMN category_id SET NOT NULL;

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audiobooks_author_id ON "maqal-book".audiobooks(author_id);
CREATE INDEX IF NOT EXISTS idx_audiobooks_category_id ON "maqal-book".audiobooks(category_id);
CREATE INDEX IF NOT EXISTS idx_audiobooks_category ON "maqal-book".audiobooks(category_id);
CREATE INDEX IF NOT EXISTS idx_audiobooks_language ON "maqal-book".audiobooks(language);
CREATE INDEX IF NOT EXISTS idx_audiobooks_created_at ON "maqal-book".audiobooks(created_at DESC);

-- Step 7: Create updated_at trigger function for maqal-book schema if it doesn't exist
CREATE OR REPLACE FUNCTION "maqal-book".update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON "maqal-book".categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON "maqal-book".categories
  FOR EACH ROW
  EXECUTE FUNCTION "maqal-book".update_updated_at_column();

DROP TRIGGER IF EXISTS update_authors_updated_at ON "maqal-book".authors;
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON "maqal-book".authors
  FOR EACH ROW
  EXECUTE FUNCTION "maqal-book".update_updated_at_column();

DROP TRIGGER IF EXISTS update_audiobooks_updated_at ON "maqal-book".audiobooks;
CREATE TRIGGER update_audiobooks_updated_at
  BEFORE UPDATE ON "maqal-book".audiobooks
  FOR EACH ROW
  EXECUTE FUNCTION "maqal-book".update_updated_at_column();

-- Step 8: Enable RLS on new tables
ALTER TABLE "maqal-book".categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE "maqal-book".authors ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can view categories and authors
CREATE POLICY "Anyone can view categories"
  ON "maqal-book".categories
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view authors"
  ON "maqal-book".authors
  FOR SELECT
  USING (true);

-- Step 9: Grant permissions
GRANT USAGE ON SCHEMA "maqal-book" TO anon, authenticated;
GRANT SELECT ON "maqal-book".categories TO anon, authenticated;
GRANT SELECT ON "maqal-book".authors TO anon, authenticated;
GRANT SELECT ON "maqal-book".audiobooks TO anon, authenticated;
