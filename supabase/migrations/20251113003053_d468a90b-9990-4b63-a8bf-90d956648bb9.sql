-- Create table for truth answers
CREATE TABLE IF NOT EXISTS public.truth_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  user_id UUID NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.truth_answers ENABLE ROW LEVEL SECURITY;

-- Users can insert their own truth answers
CREATE POLICY "Users can insert their own truth answers"
ON public.truth_answers
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_id = truth_answers.couple_id
    AND user_id = auth.uid()
  )
);

-- Users can view their couple's truth answers
CREATE POLICY "Users can view their couple's truth answers"
ON public.truth_answers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_id = truth_answers.couple_id
    AND user_id = auth.uid()
  )
);

-- Users can approve truth answers in their couple (partner can approve)
CREATE POLICY "Users can approve truth answers"
ON public.truth_answers
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_id = truth_answers.couple_id
    AND user_id = auth.uid()
  )
);

-- Users can delete their own truth answers
CREATE POLICY "Users can delete their own truth answers"
ON public.truth_answers
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_truth_answers_updated_at
BEFORE UPDATE ON public.truth_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();