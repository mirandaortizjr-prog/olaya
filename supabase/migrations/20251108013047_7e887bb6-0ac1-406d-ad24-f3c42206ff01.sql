-- Add foreign key constraint to wall_comments table
ALTER TABLE public.wall_comments
ADD CONSTRAINT wall_comments_user_id_fkey
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;