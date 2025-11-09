import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GradientId, GRADIENTS } from "@/lib/gradientData";

export const useGradients = (coupleId: string | null) => {
  const [activeGradient, setActiveGradient] = useState<GradientId>('default');
  const [purchasedGradients, setPurchasedGradients] = useState<GradientId[]>(['default']);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!coupleId) {
      setIsLoading(false);
      return;
    }

    fetchGradients();
  }, [coupleId]);

  const fetchGradients = async () => {
    if (!coupleId) return;

    try {
      const { data, error } = await supabase
        .from('couple_gradients')
        .select('*')
        .eq('couple_id', coupleId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const purchased = data.purchased_gradients as GradientId[] || ['default'];
        setPurchasedGradients(purchased);
        
        if (data.active_gradient_id) {
          setActiveGradient(data.active_gradient_id as GradientId);
          applyGradient(data.active_gradient_id as GradientId);
        }
      }
    } catch (error) {
      console.error('Error fetching gradients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseGradient = async (gradientId: GradientId) => {
    if (!coupleId) return false;

    try {
      // Check if already purchased
      if (purchasedGradients.includes(gradientId)) {
        toast({
          title: "Already Owned",
          description: "You already own this gradient!",
        });
        return false;
      }

      const newPurchased = [...purchasedGradients, gradientId];

      const { error } = await supabase
        .from('couple_gradients')
        .upsert({
          couple_id: coupleId,
          purchased_gradients: newPurchased,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'couple_id',
        });

      if (error) throw error;

      setPurchasedGradients(newPurchased);
      
      toast({
        title: "Gradient Purchased!",
        description: `${GRADIENTS[gradientId].name} has been added to your collection.`,
      });

      return true;
    } catch (error) {
      console.error('Error purchasing gradient:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase gradient. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const applyGradient = (gradientId: GradientId) => {
    const gradient = GRADIENTS[gradientId];
    if (!gradient) return;

    // Update CSS variables
    document.documentElement.style.setProperty('--video-gradient', gradient.css);
    document.documentElement.style.setProperty('--nav-gradient', gradient.css);
  };

  const setGradient = async (gradientId: GradientId) => {
    if (!coupleId) return;

    try {
      const { error } = await supabase
        .from('couple_gradients')
        .upsert({
          couple_id: coupleId,
          active_gradient_id: gradientId,
          purchased_gradients: purchasedGradients,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'couple_id',
        });

      if (error) throw error;

      setActiveGradient(gradientId);
      applyGradient(gradientId);

      toast({
        title: "Gradient Applied",
        description: `Now using ${GRADIENTS[gradientId].name}`,
      });
    } catch (error) {
      console.error('Error setting gradient:', error);
      toast({
        title: "Error",
        description: "Failed to apply gradient. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    activeGradient,
    purchasedGradients,
    isLoading,
    purchaseGradient,
    setGradient,
    fetchGradients,
  };
};
