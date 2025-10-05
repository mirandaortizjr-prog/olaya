
-- Fix Security Definer View issue for subscription_status
-- By default, views use SECURITY DEFINER (view creator's permissions)
-- We need to explicitly set security_invoker = true to use caller's permissions

-- Drop and recreate the view with security_invoker option
DROP VIEW IF EXISTS public.subscription_status;

CREATE VIEW public.subscription_status
WITH (security_invoker = true)
AS
SELECT 
  user_id,
  status,
  current_period_end,
  cancel_at_period_end,
  created_at
FROM public.subscriptions
WHERE auth.uid() = user_id;

-- Grant SELECT to authenticated users
GRANT SELECT ON public.subscription_status TO authenticated;

-- Add comment explaining the security configuration
COMMENT ON VIEW public.subscription_status IS 'View with security_invoker=true to use caller permissions instead of view creator permissions. Access is controlled by RLS policies on the underlying subscriptions table.'
