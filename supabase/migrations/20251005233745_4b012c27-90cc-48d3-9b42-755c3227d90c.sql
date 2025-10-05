-- The subscription_status is a view, not a table
-- Views don't support RLS policies, they use security_invoker mode instead
-- Recreate it with proper security settings

DROP VIEW IF EXISTS public.subscription_status CASCADE;

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
WHERE user_id = auth.uid();

-- Grant access to authenticated users
GRANT SELECT ON public.subscription_status TO authenticated;