import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SkinId, SKINS } from "@/lib/skinData";

export const useSkins = (coupleId: string | null, userId: string | null) => {
  const [activeSkin, setActiveSkin] = useState<SkinId>('default');
  const [purchasedSkins, setPurchasedSkins] = useState<SkinId[]>(['default']);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!coupleId || !userId) {
      setIsLoading(false);
      return;
    }

    fetchSkins();
  }, [coupleId, userId]);

  const fetchSkins = async () => {
    if (!coupleId || !userId) return;

    try {
      // Fetch user's purchased skins
      const { data: purchases, error: purchasesError } = await supabase
        .from('user_skin_purchases')
        .select('skin_id')
        .eq('user_id', userId);

      if (purchasesError) throw purchasesError;

      const purchased: SkinId[] = purchases ? 
        ['default', ...purchases.map(p => p.skin_id as SkinId).filter((id): id is SkinId => 
          Object.keys(SKINS).includes(id)
        )] : 
        ['default'];
      setPurchasedSkins(purchased);

      // Fetch couple's active skin
      const { data: coupleData, error: coupleError } = await supabase
        .from('couple_skins')
        .select('active_skin_id')
        .eq('couple_id', coupleId)
        .maybeSingle();

      if (coupleError && coupleError.code !== 'PGRST116') throw coupleError;

      if (coupleData?.active_skin_id) {
        setActiveSkin(coupleData.active_skin_id as SkinId);
        applySkin(coupleData.active_skin_id as SkinId);
      }
    } catch (error) {
      console.error('Error fetching skins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseSkin = async (skinId: SkinId) => {
    if (!coupleId || !userId) return false;

    try {
      // Check if already purchased
      if (purchasedSkins.includes(skinId)) {
        toast({
          title: "Already Owned",
          description: "You already own this skin!",
        });
        return false;
      }

      const { error } = await supabase
        .from('user_skin_purchases')
        .insert({
          user_id: userId,
          couple_id: coupleId,
          skin_id: skinId,
        });

      if (error) throw error;

      setPurchasedSkins([...purchasedSkins, skinId]);
      
      toast({
        title: "Skin Purchased!",
        description: `${SKINS[skinId].name} has been added to your collection.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error purchasing skin:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      toast({
        title: "Purchase Failed",
        description: error?.message || "Failed to purchase skin. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const applySkin = (skinId: SkinId) => {
    const skin = SKINS[skinId];
    if (!skin) return;

    const root = document.documentElement;
    root.style.transition = 'all 0.8s ease-in-out';
    
    // Update purple gradient areas with skin image or restore original gradients
    if (skin.image) {
      // Apply skin with proper CSS background properties for full coverage
      const skinStyles = `url(${skin.image}) center/cover no-repeat fixed`;
      root.style.setProperty('--video-gradient', skinStyles);
      root.style.setProperty('--nav-gradient', skinStyles);
      root.style.setProperty('--fantasy-consider', skinStyles);
      root.style.setProperty('--gradient-romantic', skinStyles);
      root.style.setProperty('--gradient-vibrant', skinStyles);
    } else {
      // Restore original purple gradients
      root.style.setProperty('--video-gradient', 'linear-gradient(180deg, hsl(280 50% 25%), hsl(280 60% 15%))');
      root.style.setProperty('--nav-gradient', 'linear-gradient(180deg, hsl(280 60% 15%), hsl(0 0% 0%))');
      root.style.setProperty('--fantasy-consider', 'linear-gradient(135deg, hsl(270 60% 55%), hsl(270 50% 40%))');
      root.style.setProperty('--gradient-romantic', 'linear-gradient(135deg, hsl(330 65% 48%), hsl(280 55% 50%))');
      root.style.setProperty('--gradient-vibrant', 'linear-gradient(135deg, hsl(330 65% 48%), hsl(25 75% 55%))');
    }
    
    setTimeout(() => {
      root.style.transition = '';
    }, 800);
  };

  const setSkin = async (skinId: SkinId) => {
    if (!coupleId) return;

    try {
      const { error } = await supabase
        .from('couple_skins')
        .upsert({
          couple_id: coupleId,
          active_skin_id: skinId,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'couple_id',
        });

      if (error) throw error;

      setActiveSkin(skinId);
      applySkin(skinId);

      toast({
        title: "Skin Applied",
        description: `Now using ${SKINS[skinId].name}`,
      });
    } catch (error) {
      console.error('Error setting skin:', error);
      toast({
        title: "Error",
        description: "Failed to apply skin. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    activeSkin,
    purchasedSkins,
    isLoading,
    purchaseSkin,
    setSkin,
    fetchSkins,
  };
};
