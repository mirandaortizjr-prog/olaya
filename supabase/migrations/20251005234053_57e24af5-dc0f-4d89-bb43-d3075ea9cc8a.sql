-- Fix invite code security vulnerability
-- Problem: Any couple member can see the invite code, allowing malicious partners 
-- to share unused codes with unauthorized third parties

-- Step 1: Add a column to track who created the couple (nullable initially)
ALTER TABLE public.couples 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Step 2: Update existing couples to set created_by based on first member
-- Only update couples that have members
UPDATE public.couples c
SET created_by = (
  SELECT cm.user_id 
  FROM public.couple_members cm 
  WHERE cm.couple_id = c.id 
  ORDER BY cm.joined_at ASC 
  LIMIT 1
)
WHERE created_by IS NULL
AND EXISTS (
  SELECT 1 FROM public.couple_members cm2 
  WHERE cm2.couple_id = c.id
);

-- Step 3: Update the add_creator_as_member function to set created_by
CREATE OR REPLACE FUNCTION public.add_creator_as_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set created_by if not already set
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  
  -- Add creator as member
  INSERT INTO public.couple_members (couple_id, user_id)
  VALUES (NEW.id, auth.uid())
  ON CONFLICT (couple_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Step 4: Create a secure function to get invite code (only for creator)
CREATE OR REPLACE FUNCTION public.get_couple_invite_code(couple_uuid uuid)
RETURNS TABLE(invite_code text, expires_at timestamp with time zone, is_used boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only the couple creator can retrieve the invite code
  IF NOT EXISTS (
    SELECT 1 FROM couples 
    WHERE id = couple_uuid 
    AND created_by = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only the couple creator can access the invite code';
  END IF;

  RETURN QUERY
  SELECT 
    c.invite_code,
    c.invite_code_expires_at,
    c.invite_code_used
  FROM couples c
  WHERE c.id = couple_uuid;
END;
$$;

-- Step 5: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_couple_invite_code(uuid) TO authenticated;

-- Note: We keep the RLS policy as is for now. The frontend code should be updated
-- to use get_couple_invite_code() function instead of reading invite_code directly
-- from the couples table query