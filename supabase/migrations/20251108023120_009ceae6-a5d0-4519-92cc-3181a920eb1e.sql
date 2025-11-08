-- Create intimate journal table for couple encounters
CREATE TABLE IF NOT EXISTS public.intimate_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  created_by UUID NOT NULL,
  encounter_date DATE NOT NULL,
  encounter_time TIME,
  location TEXT,
  user_experience TEXT NOT NULL,
  partner_experience TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.intimate_journal ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their couple's journal entries"
ON public.intimate_journal
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = intimate_journal.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create journal entries"
ON public.intimate_journal
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = intimate_journal.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own entries"
ON public.intimate_journal
FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own entries"
ON public.intimate_journal
FOR DELETE
USING (auth.uid() = created_by);

-- Add trigger for updated_at
CREATE TRIGGER update_intimate_journal_updated_at
BEFORE UPDATE ON public.intimate_journal
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();