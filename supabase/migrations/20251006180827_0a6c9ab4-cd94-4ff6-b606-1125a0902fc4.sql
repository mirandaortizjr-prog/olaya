-- Update the mood_tracker check constraint to include the new 'horny' mood type
ALTER TABLE mood_tracker 
DROP CONSTRAINT IF EXISTS mood_tracker_mood_type_check;

ALTER TABLE mood_tracker 
ADD CONSTRAINT mood_tracker_mood_type_check 
CHECK (mood_type IN (
  'tender', 'playful', 'loving', 'peaceful', 'excited', 'happy', 'horny',
  'sad', 'worried', 'anxious', 'frustrated', 'heartbroken', 'content', 
  'stressed', 'needSpace', 'grateful', 'romantic', 'energetic'
));