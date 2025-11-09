-- Create table for couple desire preferences
CREATE TABLE IF NOT EXISTS public.couple_desire_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  favorite_desires JSONB DEFAULT '[]'::jsonb,
  custom_desires JSONB DEFAULT '[]'::jsonb,
  show_all BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(couple_id)
);

-- Enable RLS
ALTER TABLE public.couple_desire_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their couple's desire preferences"
ON public.couple_desire_preferences
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_desire_preferences.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their couple's desire preferences"
ON public.couple_desire_preferences
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_desire_preferences.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their couple's desire preferences"
ON public.couple_desire_preferences
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_desire_preferences.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_couple_desire_preferences_updated_at
BEFORE UPDATE ON public.couple_desire_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();