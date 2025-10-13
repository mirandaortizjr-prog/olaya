import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSubscription = (userId: string | undefined) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    const checkSubscription = async () => {
      try {
        // Use secure function instead of direct table access
        const { data, error } = await supabase
          .rpc('get_user_subscription_status')
          .maybeSingle();

        if (error) throw error;

        const isActive = data?.status === 'active' || data?.status === 'trialing';
        setIsPremium(isActive);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Subscription check error:', error);
        }
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

    // Subscribe to subscription changes
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          // Re-fetch from secure function when subscription changes
          const { data } = await supabase
            .rpc('get_user_subscription_status')
            .maybeSingle();
          
          const newStatus = data?.status;
          const isActive = newStatus === 'active' || newStatus === 'trialing';
          setIsPremium(isActive);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
      if (import.meta.env.DEV) {
        console.error('Checkout error:', error);
      }
      toast({
        title: 'Error',
        description: 'Failed to start checkout process',
        variant: 'destructive',
      });
    }
  };

  return { isPremium, isLoading, createCheckoutSession };
};
