-- Add name column to couples table to allow personalization
ALTER TABLE public.couples
ADD COLUMN name TEXT DEFAULT 'Our Sanctuary';

-- Add comment explaining the column
COMMENT ON COLUMN public.couples.name IS 'Custom name for the couple sanctuary, defaults to "Our Sanctuary"';