-- Create subscriptions table to track Stripe subscriptions
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status text NOT NULL DEFAULT 'inactive',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON public.subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create desire vault table
CREATE TABLE public.desire_vault (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  is_private boolean DEFAULT true,
  fulfilled boolean DEFAULT false,
  fulfilled_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.desire_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their couple's desires"
  ON public.desire_vault
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = desire_vault.couple_id
    AND couple_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can create desires"
  ON public.desire_vault
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = desire_vault.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own desires"
  ON public.desire_vault
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own desires"
  ON public.desire_vault
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create shared journal table
CREATE TABLE public.shared_journal (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid NOT NULL,
  author_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  mood text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their couple's journal"
  ON public.shared_journal
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = shared_journal.couple_id
    AND couple_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can create journal entries"
  ON public.shared_journal
  FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = shared_journal.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own entries"
  ON public.shared_journal
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own entries"
  ON public.shared_journal
  FOR DELETE
  USING (auth.uid() = author_id);

-- Create relationship timeline table
CREATE TABLE public.relationship_timeline (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid NOT NULL,
  created_by uuid NOT NULL,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_type text NOT NULL,
  photos jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.relationship_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their couple's timeline"
  ON public.relationship_timeline
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = relationship_timeline.couple_id
    AND couple_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can create timeline events"
  ON public.relationship_timeline
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = relationship_timeline.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own events"
  ON public.relationship_timeline
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
  ON public.relationship_timeline
  FOR DELETE
  USING (auth.uid() = created_by);

-- Create love language preferences table
CREATE TABLE public.love_languages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  primary_language text NOT NULL,
  secondary_language text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.love_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their partner's love language"
  ON public.love_languages
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM couple_members cm1
    JOIN couple_members cm2 ON cm1.couple_id = cm2.couple_id
    WHERE cm1.user_id = auth.uid()
    AND cm2.user_id = love_languages.user_id
  ));

CREATE POLICY "Users can insert their own love language"
  ON public.love_languages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own love language"
  ON public.love_languages
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create posts table
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid NOT NULL,
  author_id uuid NOT NULL,
  content text NOT NULL,
  media_urls jsonb,
  likes jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their couple's posts"
  ON public.posts
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = posts.couple_id
    AND couple_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = posts.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- Add update trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add update triggers for new tables
CREATE TRIGGER update_desire_vault_updated_at
  BEFORE UPDATE ON public.desire_vault
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shared_journal_updated_at
  BEFORE UPDATE ON public.shared_journal
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_relationship_timeline_updated_at
  BEFORE UPDATE ON public.relationship_timeline
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_love_languages_updated_at
  BEFORE UPDATE ON public.love_languages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();