-- Create storage bucket for shared media
INSERT INTO storage.buckets (id, name, public)
VALUES ('couple_media', 'couple_media', false);

-- Create shared_media table to track uploads
CREATE TABLE public.shared_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_media ENABLE ROW LEVEL SECURITY;

-- Users can view media from their couple
CREATE POLICY "Users can view their couple's media"
ON public.shared_media
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = shared_media.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can upload media to their couple
CREATE POLICY "Users can upload media"
ON public.shared_media
FOR INSERT
WITH CHECK (
  auth.uid() = uploaded_by
  AND EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = shared_media.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can delete their own media
CREATE POLICY "Users can delete their own media"
ON public.shared_media
FOR DELETE
USING (auth.uid() = uploaded_by);

-- Storage policies for couple_media bucket
CREATE POLICY "Users can view media from their couple"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'couple_media'
  AND EXISTS (
    SELECT 1 FROM public.couple_members cm
    JOIN public.shared_media sm ON sm.file_path = storage.objects.name
    WHERE cm.couple_id = sm.couple_id
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload media to their couple folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'couple_media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'couple_media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Enable realtime for shared media
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_media;