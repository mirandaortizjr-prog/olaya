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
        // Use secure view instead of direct table access
        const { data, error } = await supabase
          .from('subscription_status')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;

        const isActive = data?.status === 'active' || data?.status === 'trialing';
        setIsPremium(isActive);
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
          // Re-fetch from secure view when subscription changes
          const { data } = await supabase
            .from('subscription_status')
            .select('*')
            .eq('user_id', userId)
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
          userId,
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
