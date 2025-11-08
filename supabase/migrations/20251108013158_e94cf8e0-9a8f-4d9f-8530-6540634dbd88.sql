-- Fix wall_comments user relation to enable embedding profiles
ALTER TABLE public.wall_comments
DROP CONSTRAINT IF EXISTS wall_comments_user_id_fkey;

ALTER TABLE public.wall_comments
ADD CONSTRAINT wall_comments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Helpful index for couple feed ordering
CREATE INDEX IF NOT EXISTS idx_wall_comments_couple_created
ON public.wall_comments (couple_id, created_at DESC);