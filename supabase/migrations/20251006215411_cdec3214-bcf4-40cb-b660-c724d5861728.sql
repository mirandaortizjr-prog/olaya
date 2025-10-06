-- Drop existing policy if exists and recreate
DROP POLICY IF EXISTS "Couple members can view couple folder media" ON storage.objects;

-- Allow couple members to view media in their couple folder (for signing/display)
CREATE POLICY "Couple members can view couple folder media"
ON storage.objects
FOR SELECT
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