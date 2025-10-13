-- Add explicit policy to deny public access to subscriptions table
CREATE POLICY "Deny all public access to subscriptions"
ON subscriptions
FOR ALL
TO anon
USING (false);

-- Add explicit policy to deny public access to profiles table  
CREATE POLICY "Deny all public access to profiles"
ON profiles
FOR ALL
TO anon
USING (false);

-- For subscription_status view, we need to recreate it as a security definer function instead
-- Drop the existing view
DROP VIEW IF EXISTS subscription_status;

-- Create a security definer function to safely expose subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status()
RETURNS TABLE (
  user_id uuid,
  status text,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    user_id,
    status,
    current_period_end,
    cancel_at_period_end,
    created_at
  FROM subscriptions
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;