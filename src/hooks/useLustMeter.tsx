import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLustMeter = (coupleId?: string) => {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchScore = async () => {
    if (!coupleId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .rpc('get_lust_meter_score', { p_user_id: user.id });

      if (error) throw error;
      setScore(data || 0);
    } catch (error) {
      console.error('Error fetching lust meter score:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackInteraction = async (interactionType: string) => {
    if (!coupleId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('private_interactions')
        .insert({
          user_id: user.id,
          couple_id: coupleId,
          interaction_type: interactionType
        });

      if (error) throw error;

      // Refresh score
      await fetchScore();
      
      toast({
        title: "Interaction tracked! 🔥",
        description: "Your Lust-O-Meter has been updated.",
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  useEffect(() => {
    fetchScore();
  }, [coupleId]);

  return { score, loading, trackInteraction };
};
