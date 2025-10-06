-- Create a dedicated policy for couple picture uploads
-- This allows couple members to upload to their couple's folder
CREATE POLICY "Couple members can upload couple pictures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'couple_media'
  AND EXISTS (
    SELECT 1 FROM couples c
    JOIN couple_members cm ON cm.couple_id = c.id
    WHERE cm.user_id = auth.uid()
    AND (storage.foldername(name))[1] = c.id::text
  )
);

-- Allow couple members to update couple pictures
CREATE POLICY "Couple members can update couple pictures"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'couple_media'
  AND EXISTS (
    SELECT 1 FROM couples c
    JOIN couple_members cm ON cm.couple_id = c.id
    WHERE cm.user_id = auth.uid()
    AND (storage.foldername(name))[1] = c.id::text
  )
);