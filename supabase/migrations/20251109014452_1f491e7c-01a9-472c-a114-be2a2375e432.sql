-- Enable real-time for purchased_gifts table
ALTER TABLE public.purchased_gifts REPLICA IDENTITY FULL;

-- Add purchased_gifts to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.purchased_gifts;