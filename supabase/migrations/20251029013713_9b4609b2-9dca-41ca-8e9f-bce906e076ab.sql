-- Drop existing check constraint on file_type
ALTER TABLE shared_media DROP CONSTRAINT IF EXISTS shared_media_file_type_check;

-- Add updated check constraint that includes private_photo
ALTER TABLE shared_media ADD CONSTRAINT shared_media_file_type_check 
CHECK (file_type IN ('image', 'video', 'private_photo'));