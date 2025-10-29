-- Update couples table to support multiple songs (playlist)
ALTER TABLE couples 
DROP COLUMN IF EXISTS couple_song_url;

ALTER TABLE couples 
ADD COLUMN couple_songs jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN couples.couple_songs IS 'Array of YouTube URLs for the couple playlist (max 5 songs)';