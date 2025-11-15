import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSubscription = (userId: string | undefined) => {
  // TESTING MODE: All features unlocked for testing
  const [isPremium, setIsPremium] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    const checkSubscription = async () => {
      try {
        // Check if user is admin or has active subscription
        const { data, error } = await supabase
          .rpc('is_premium_user', { _user_id: userId });

        if (error) throw error;

        setIsPremium(data || false);
      } catch (error) {
        console.error('Error checking subscription:', error);
        toast({
          title: 'Error',
          description: 'Failed to check subscription status',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();

    // Subscribe to changes that affect premium status
    const subscriptionChannel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${userId}`,
        },
        checkSubscription
      )
      .subscribe();

    const rolesChannel = supabase
      .channel('role-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${userId}`,
        },
        checkSubscription
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscriptionChannel);
      supabase.removeChannel(rolesChannel);
    };
  }, [userId, toast]);

  const createCheckoutSession = async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1234567890', // Replace with actual Stripe price ID
          email,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Error',
        description: 'Failed to start checkout process',
        variant: 'destructive',
      });
    }
  };

  return { isPremium, isLoading, createCheckoutSession };
};
