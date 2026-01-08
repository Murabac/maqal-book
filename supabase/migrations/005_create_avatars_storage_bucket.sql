-- Create storage bucket for user avatars
-- Note: Storage buckets need to be created via Supabase Dashboard or CLI
-- This migration is for reference/documentation purposes

-- Instructions to create the bucket:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named 'avatars'
-- 3. Set it to Public (so users can view avatars)
-- 4. Add the following policies via SQL Editor or Supabase Dashboard:

-- Policy: Allow authenticated users to upload avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');




