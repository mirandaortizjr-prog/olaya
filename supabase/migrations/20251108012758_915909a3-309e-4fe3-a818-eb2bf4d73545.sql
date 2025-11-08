-- Create wall_comments table for sexy comments between couples
CREATE TABLE public.wall_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wall_comments ENABLE ROW LEVEL SECURITY;

-- Users can view their couple's wall comments
CREATE POLICY "Users can view their couple's wall comments"
ON public.wall_comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = wall_comments.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can create wall comments
CREATE POLICY "Users can create wall comments"
ON public.wall_comments
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = wall_comments.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own wall comments"
ON public.wall_comments
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_wall_comments_updated_at
BEFORE UPDATE ON public.wall_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();