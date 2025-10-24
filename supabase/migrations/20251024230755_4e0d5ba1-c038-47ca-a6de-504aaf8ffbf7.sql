-- Add couple_song_url column to couples table
ALTER TABLE public.couples 
ADD COLUMN couple_song_url text;

COMMENT ON COLUMN public.couples.couple_song_url IS 'YouTube or YouTube Music URL for the couple''s special song';