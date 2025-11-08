import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTogetherCoins = (userId: string | undefined) => {
  const [coins, setCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCoins = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('together_coins')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setCoins(data?.together_coins || 0);
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCoins = async (amount: number, description: string, coupleId?: string) => {
    if (!userId) return false;

    try {
      // Update profile coins
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ together_coins: coins + amount })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: userId,
          couple_id: coupleId || null,
          transaction_type: 'purchase',
          amount,
          description,
        });

      if (transactionError) throw transactionError;

      setCoins(coins + amount);
      
      toast({
        title: "Coins Added! ✨",
        description: `You received ${amount} Together Coins`,
      });

      return true;
    } catch (error) {
      console.error('Error adding coins:', error);
      toast({
        title: "Error",
        description: "Failed to add coins",
        variant: "destructive",
      });
      return false;
    }
  };

  const spendCoins = async (amount: number, description: string, coupleId?: string) => {
    if (!userId || coins < amount) return false;

    try {
      // Update profile coins
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ together_coins: coins - amount })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: userId,
          couple_id: coupleId || null,
          transaction_type: 'spend',
          amount: -amount,
          description,
        });

      if (transactionError) throw transactionError;

      setCoins(coins - amount);

      toast({
        title: "Purchase Complete! 🎁",
        description: description,
      });

      return true;
    } catch (error) {
      console.error('Error spending coins:', error);
      toast({
        title: "Error",
        description: "Failed to complete purchase",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCoins();

    // Subscribe to coin changes
    const channel = supabase
      .channel('coin-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new && 'together_coins' in payload.new) {
            setCoins(payload.new.together_coins as number);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { coins, isLoading, addCoins, spendCoins, fetchCoins };
};
