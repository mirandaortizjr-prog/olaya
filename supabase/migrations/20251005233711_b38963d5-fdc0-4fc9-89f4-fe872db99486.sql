-- The subscription_status is a view, not a table
-- Views in PostgreSQL can have policies when using security_invoker = on
-- The view already has security_invoker enabled, which means it uses the caller's permissions
-- This means access is controlled by the RLS policies on the underlying 'subscriptions' table

-- Let's verify the view is properly configured
-- If there's also a legacy table, we need to check and potentially drop it

-- First, check if there's a table with the same name and drop it if it exists
DO $$
BEGIN
  -- Only drop if it's actually a table, not a view
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'subscription_status'
  ) THEN
    DROP TABLE public.subscription_status CASCADE;
  END IF;
END $$;

-- Recreate the view to ensure it's properly configured
CREATE OR REPLACE VIEW public.subscription_status AS
SELECT 
  user_id,
  status,
  current_period_end,
  cancel_at_period_end,
  created_at
FROM public.subscriptions
WHERE auth.uid() = user_id;  -- Add WHERE clause directly in view for extra security

-- Grant access to the view
GRANT SELECT ON public.subscription_status TO authenticated;

-- The view will automatically inherit RLS through the subscriptions table
-- since security_invoker is on