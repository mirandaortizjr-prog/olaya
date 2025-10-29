-- Drop table if it exists (from previous failed migration)
DROP TABLE IF EXISTS public.couple_background_images CASCADE;

-- Create table for couple background images
CREATE TABLE public.couple_background_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.couple_background_images ENABLE ROW LEVEL SECURITY;

-- Create policies for couple background images
CREATE POLICY "Users can view their couple's background images"
ON public.couple_background_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members 
    WHERE couple_members.couple_id = couple_background_images.couple_id 
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their couple's background images"
ON public.couple_background_images
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.couple_members 
    WHERE couple_members.couple_id = couple_background_images.couple_id 
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their couple's background images"
ON public.couple_background_images
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members 
    WHERE couple_members.couple_id = couple_background_images.couple_id 
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their couple's background images"
ON public.couple_background_images
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members 
    WHERE couple_members.couple_id = couple_background_images.couple_id 
    AND couple_members.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_couple_background_images_updated_at
BEFORE UPDATE ON public.couple_background_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX idx_couple_background_images_couple_id ON public.couple_background_images(couple_id);
CREATE INDEX idx_couple_background_images_display_order ON public.couple_background_images(couple_id, display_order);