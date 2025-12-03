-- Create devotional progress table
CREATE TABLE public.devotional_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  couple_id UUID NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_day INTEGER NOT NULL DEFAULT 1,
  last_read_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.devotional_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own devotional progress"
ON public.devotional_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devotional progress"
ON public.devotional_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devotional progress"
ON public.devotional_progress
FOR UPDATE
USING (auth.uid() = user_id);