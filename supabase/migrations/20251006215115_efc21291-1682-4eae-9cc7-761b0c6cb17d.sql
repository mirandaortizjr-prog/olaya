-- Drop the conflicting policy that only allows user ID folders
DROP POLICY IF EXISTS "Couple members can upload media for posts" ON storage.objects;

-- Create a comprehensive policy that allows both user folders (for posts) and couple folders (for couple pictures)
CREATE POLICY "Couple members can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'couple_media' 
  AND (
    -- Allow uploads to user's own folder (for posts with media)
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Allow uploads to couple folder (for couple pictures)
    EXISTS (
      SELECT 1 FROM couples c
      JOIN couple_members cm ON cm.couple_id = c.id
      WHERE cm.user_id = auth.uid()
      AND c.id::text = (storage.foldername(name))[1]
    )
  )
);