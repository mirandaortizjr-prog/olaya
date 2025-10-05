-- Create memory_calendar table for special dates and anniversaries
CREATE TABLE public.memory_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('anniversary', 'birthday', 'first_date', 'first_kiss', 'engagement', 'custom')),
  notes TEXT,
  recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_calendar ENABLE ROW LEVEL SECURITY;

-- Users can view memory calendar from their couple
CREATE POLICY "Users can view their couple's memory calendar"
ON public.memory_calendar
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = memory_calendar.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can add memories to their couple calendar
CREATE POLICY "Users can add memories to calendar"
ON public.memory_calendar
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = memory_calendar.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can update memories they created
CREATE POLICY "Users can update their own memories"
ON public.memory_calendar
FOR UPDATE
USING (auth.uid() = created_by);

-- Users can delete memories they created
CREATE POLICY "Users can delete their own memories"
ON public.memory_calendar
FOR DELETE
USING (auth.uid() = created_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_memory_calendar_updated_at
BEFORE UPDATE ON public.memory_calendar
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for memory calendar
ALTER PUBLICATION supabase_realtime ADD TABLE public.memory_calendar;