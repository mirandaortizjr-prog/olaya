-- Create storage policies for private vault photos
-- Allow users to upload their own private photos
CREATE POLICY "Users can upload private photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'couple_media' 
  AND (storage.foldername(name))[1] = 'private'
  AND auth.uid()::text = (storage.foldername(name))[3]
);

-- Allow users to view their own private photos
CREATE POLICY "Users can view their own private photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'couple_media'
  AND (storage.foldername(name))[1] = 'private'
  AND auth.uid()::text = (storage.foldername(name))[3]
);

-- Allow users to delete their own private photos
CREATE POLICY "Users can delete their own private photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'couple_media'
  AND (storage.foldername(name))[1] = 'private'
  AND auth.uid()::text = (storage.foldername(name))[3]
);