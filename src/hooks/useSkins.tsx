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
        ['default', ...purchases.map(p => p.skin_id).filter((id): id is SkinId => 
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
    } catch (error) {
      console.error('Error purchasing skin:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase skin. Please try again.",
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
    
    // Update background image or remove it
    if (skin.image) {
      root.style.setProperty('--background-skin', `url(${skin.image})`);
    } else {
      root.style.setProperty('--background-skin', 'none');
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
