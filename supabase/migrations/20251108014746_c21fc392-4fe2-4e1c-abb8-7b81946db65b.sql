-- Create storage bucket for private photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('private_photos', 'private_photos', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for private_photos bucket
CREATE POLICY "Users can view their couple's private photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'private_photos' AND
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id::text = (storage.foldername(name))[1]
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload their couple's private photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'private_photos' AND
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id::text = (storage.foldername(name))[1]
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their couple's private photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'private_photos' AND
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id::text = (storage.foldername(name))[1]
    AND couple_members.user_id = auth.uid()
  )
);

-- Create table to track private photos metadata
CREATE TABLE public.private_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  uploaded_by UUID NOT NULL,
  file_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.private_photos ENABLE ROW LEVEL SECURITY;

-- Users can view their couple's photos
CREATE POLICY "Users can view their couple's private photos"
ON public.private_photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = private_photos.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can upload photos
CREATE POLICY "Users can upload private photos"
ON public.private_photos FOR INSERT
WITH CHECK (
  auth.uid() = uploaded_by AND
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = private_photos.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can delete their own photos
CREATE POLICY "Users can delete their own private photos"
ON public.private_photos FOR DELETE
USING (auth.uid() = uploaded_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_private_photos_updated_at
BEFORE UPDATE ON public.private_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();