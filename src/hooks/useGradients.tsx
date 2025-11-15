import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GradientId, GRADIENTS } from "@/lib/gradientData";

export const useGradients = (coupleId: string | null, userId: string | null) => {
  const [activeGradient, setActiveGradient] = useState<GradientId>('default');
  const [purchasedGradients, setPurchasedGradients] = useState<GradientId[]>(['default']);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!coupleId || !userId) {
      setIsLoading(false);
      return;
    }

    fetchGradients();
  }, [coupleId, userId]);

  const fetchGradients = async () => {
    if (!coupleId || !userId) return;

    try {
      // Fetch user's purchased gradients
      const { data: purchases, error: purchasesError } = await supabase
        .from('user_gradient_purchases')
        .select('gradient_id')
        .eq('user_id', userId);

      if (purchasesError) throw purchasesError;

      const purchased: GradientId[] = purchases ? 
        ['default', ...purchases.map(p => p.gradient_id).filter((id): id is GradientId => 
          Object.keys(GRADIENTS).includes(id)
        )] : 
        ['default'];
      setPurchasedGradients(purchased);

      // Fetch couple's active gradient
      const { data: coupleData, error: coupleError } = await supabase
        .from('couple_gradients')
        .select('active_gradient_id')
        .eq('couple_id', coupleId)
        .maybeSingle();

      if (coupleError && coupleError.code !== 'PGRST116') throw coupleError;

      if (coupleData?.active_gradient_id) {
        setActiveGradient(coupleData.active_gradient_id as GradientId);
        applyGradient(coupleData.active_gradient_id as GradientId);
      }
    } catch (error) {
      console.error('Error fetching gradients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseGradient = async (gradientId: GradientId) => {
    if (!coupleId || !userId) return false;

    try {
      // Check if already purchased
      if (purchasedGradients.includes(gradientId)) {
        toast({
          title: "Already Owned",
          description: "You already own this gradient!",
        });
        return false;
      }

      const { error } = await supabase
        .from('user_gradient_purchases')
        .insert({
          user_id: userId,
          couple_id: coupleId,
          gradient_id: gradientId,
        });

      if (error) throw error;

      setPurchasedGradients([...purchasedGradients, gradientId]);
      
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

    // Add transition class to root element for smooth gradient changes
    const root = document.documentElement;
    root.style.transition = 'all 0.8s ease-in-out';
    
    // Update CSS variables for gradients
    root.style.setProperty('--video-gradient', gradient.css);
    root.style.setProperty('--nav-gradient', gradient.css);
    
    // Update foreground color for icons and text that need to contrast with the gradient
    const foregroundColor = 'foregroundColor' in gradient ? gradient.foregroundColor : 'hsl(var(--foreground))';
    root.style.setProperty('--gradient-foreground', foregroundColor);
    
    // Remove transition after animation completes
    setTimeout(() => {
      root.style.transition = '';
    }, 800);
  };

  const setGradient = async (gradientId: GradientId) => {
    if (!coupleId) return;

    try {
      const { error } = await supabase
        .from('couple_gradients')
        .upsert({
          couple_id: coupleId,
          active_gradient_id: gradientId,
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
