-- Fix security definer view warning
-- The subscription_status view should use security_invoker instead of security_definer

-- Drop and recreate with proper security settings
DROP VIEW IF EXISTS public.subscription_status;

CREATE VIEW public.subscription_status 
WITH (security_invoker = on)
AS
SELECT 
  user_id,
  status,
  current_period_end,
  cancel_at_period_end,
  created_at
FROM public.subscriptions
WHERE auth.uid() = user_id;

-- Grant access to authenticated users
GRANT SELECT ON public.subscription_status TO authenticated;