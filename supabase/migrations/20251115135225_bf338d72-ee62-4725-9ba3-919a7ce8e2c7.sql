-- Create enum for poem categories
CREATE TYPE poem_category AS ENUM ('Funny', 'Romantic', 'Kinky', 'Deep', 'Wildcard', 'FreePlay');

-- Create enum for poem types
CREATE TYPE poem_type AS ENUM ('Haiku', 'Sonnet', 'EightVerse', 'FreePlay');

-- Create enum for poem status
CREATE TYPE poem_status AS ENUM ('Active', 'Completed');

-- Create poems table
CREATE TABLE public.poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  title TEXT,
  category poem_category NOT NULL,
  poem_type poem_type NOT NULL,
  lines JSONB DEFAULT '[]'::jsonb,
  status poem_status DEFAULT 'Active',
  published_to_feed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  saved_at TIMESTAMP WITH TIME ZONE,
  tags JSONB DEFAULT '[]'::jsonb,
  created_by UUID NOT NULL
);

-- Enable RLS
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;

-- Users can view their couple's poems
CREATE POLICY "Users can view their couple's poems"
ON public.poems
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = poems.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can create poems for their couple
CREATE POLICY "Users can create poems"
ON public.poems
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = poems.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can update their couple's poems
CREATE POLICY "Users can update their couple's poems"
ON public.poems
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = poems.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can delete their couple's poems
CREATE POLICY "Users can delete their couple's poems"
ON public.poems
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = poems.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Enable realtime for poems
ALTER PUBLICATION supabase_realtime ADD TABLE public.poems;