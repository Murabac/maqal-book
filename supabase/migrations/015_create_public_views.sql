-- Migration: Create views for easy querying with joined data
-- These views join audiobooks with categories and authors for convenient access
-- Views are created in both maqal-book and public schemas for compatibility

-- Drop existing views if they exist
DROP VIEW IF EXISTS "maqal-book".audiobooks_view CASCADE;
DROP VIEW IF EXISTS "maqal-book".categories_view CASCADE;
DROP VIEW IF EXISTS "maqal-book".authors_view CASCADE;
DROP VIEW IF EXISTS public.audiobooks CASCADE;
DROP VIEW IF EXISTS public.categories CASCADE;
DROP VIEW IF EXISTS public.authors CASCADE;

-- Step 1: Create maqal-book.audiobooks_view with joined data
CREATE VIEW "maqal-book".audiobooks_view AS
SELECT 
  ab.id,
  ab.title,
  ab.cover,
  ab.duration,
  ab.language,
  ab.created_at,
  ab.updated_at,
  -- Author fields
  ab.author_id,
  COALESCE(a.name, 'Unknown Author') AS author_name,
  a.bio AS author_bio,
  -- Category fields
  ab.category_id,
  COALESCE(c.name, 'Uncategorized') AS category_name,
  c.description AS category_description
FROM "maqal-book".audiobooks ab
LEFT JOIN "maqal-book".authors a ON ab.author_id = a.id
LEFT JOIN "maqal-book".categories c ON ab.category_id = c.id;

-- Step 2: Create maqal-book.categories_view (direct access to categories)
CREATE VIEW "maqal-book".categories_view AS
SELECT 
  id,
  name,
  description,
  created_at,
  updated_at
FROM "maqal-book".categories;

-- Step 3: Create maqal-book.authors_view (direct access to authors)
CREATE VIEW "maqal-book".authors_view AS
SELECT 
  id,
  name,
  bio,
  created_at,
  updated_at
FROM "maqal-book".authors;

-- Step 4: Also create public views for backward compatibility
CREATE VIEW public.audiobooks AS
SELECT * FROM "maqal-book".audiobooks_view;

CREATE VIEW public.categories AS
SELECT * FROM "maqal-book".categories_view;

CREATE VIEW public.authors AS
SELECT * FROM "maqal-book".authors_view;

-- Step 5: Grant permissions on views
GRANT SELECT ON "maqal-book".audiobooks_view TO anon, authenticated;
GRANT SELECT ON "maqal-book".categories_view TO anon, authenticated;
GRANT SELECT ON "maqal-book".authors_view TO anon, authenticated;
GRANT SELECT ON public.audiobooks TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.authors TO anon, authenticated;

-- Note: The views will use the RLS policies from the underlying tables
