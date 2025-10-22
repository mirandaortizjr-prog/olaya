-- Add unique constraint for feeling_status to enable proper upsert
ALTER TABLE public.feeling_status 
ADD CONSTRAINT feeling_status_user_couple_unique UNIQUE (user_id, couple_id);