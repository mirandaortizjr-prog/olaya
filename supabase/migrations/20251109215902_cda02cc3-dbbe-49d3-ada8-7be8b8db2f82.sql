-- Create storage bucket for Truth or Dare proof uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'truth-dare-proofs',
  'truth-dare-proofs',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
);

-- Create RLS policies for proof uploads
CREATE POLICY "Users can upload their own proofs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'truth-dare-proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Couple members can view proofs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'truth-dare-proofs' AND
  EXISTS (
    SELECT 1 FROM couple_members cm1
    JOIN couple_members cm2 ON cm1.couple_id = cm2.couple_id
    WHERE cm1.user_id = auth.uid()
    AND cm2.user_id::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Users can delete their own proofs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'truth-dare-proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add proof_url column to game_sessions table
ALTER TABLE game_sessions
ADD COLUMN proof_url TEXT;