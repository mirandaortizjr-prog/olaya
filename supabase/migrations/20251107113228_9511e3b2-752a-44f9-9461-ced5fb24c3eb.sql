-- Add platform column to push_subscriptions table
ALTER TABLE public.push_subscriptions
ADD COLUMN platform text DEFAULT 'web';

-- Add comment to explain the column
COMMENT ON COLUMN public.push_subscriptions.platform IS 'Platform type: web, android, or ios';
