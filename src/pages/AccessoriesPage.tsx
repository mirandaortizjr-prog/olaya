import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { useGradients } from "@/hooks/useGradients";
import { GradientSelector } from "@/components/GradientSelector";
import { GRADIENTS, GradientId } from "@/lib/gradientData";

interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
}

export default function AccessoriesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [userId, setUserId] = useState<string>("");
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [gradients, setGradients] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { coins, spendCoins } = useTogetherCoins(userId);
  const {
    activeGradient,
    purchasedGradients,
    purchaseGradient,
    setGradient,
  } = useGradients(coupleId, userId || null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (coupleId) {
      fetchGradients();
    }
  }, [coupleId]);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);

      const { data: memberData } = await supabase
        .from("couple_members")
        .select("couple_id")
        .eq("user_id", user.id)
        .single();

      if (memberData) {
        setCoupleId(memberData.couple_id);
      }
    }
  };

  const fetchGradients = async () => {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("*")
        .eq("category", "accessories")
        .order("name");

      if (error) throw error;
      setGradients(data || []);
    } catch (error) {
      console.error("Error fetching gradients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradientIdFromName = (name: string): GradientId => {
    const mapping: Record<string, GradientId> = {
      'Purple Coral Gradient': 'purple-coral',
      'Gold Pink Gradient': 'gold-pink',
      'Pink Gold Gradient': 'pink-gold',
      'Cyan Gold Gradient': 'cyan-gold',
      'Teal Lime Gradient': 'teal-lime',
      'Purple Lime Gradient': 'purple-lime',
      'Purple Cyan Gradient': 'purple-cyan',
      'Blue Cyan Gradient': 'blue-cyan',
      'Cyan to Dark Blue': 'cyan-darkblue',
      'Black to Dark Gray': 'black-darkgray',
      'Dark Gray to White': 'darkgray-white',
      'Light Gray to White': 'lightgray-white',
      'Black to Dark Blue': 'black-darkblue',
      'Dark Blue to Bright Blue': 'darkblue-brightblue',
      'Pale Green to Light Blue': 'palegreen-lightblue',
      'Red to Orange': 'red-orange',
    };
    return mapping[name] || 'default';
  };

  const handlePurchase = async (item: ShopItem) => {
    if (!userId || !coupleId) {
      toast({
        title: t('error') || 'Error',
        description: t('pleaseSignIn') || 'Please sign in to purchase items',
        variant: "destructive",
      });
      return;
    }

    const gradientId = getGradientIdFromName(item.name);

    if (purchasedGradients.includes(gradientId)) {
      toast({
        title: t('alreadyOwned') || 'Already Owned',
        description: t('youAlreadyOwnThisGradient') || 'You already own this gradient!',
      });
      return;
    }

    if (coins < item.price) {
      toast({
        title: t('notEnoughCoins') || 'Not Enough Coins',
        description: t('needMoreCoins') || `You need ${item.price - coins} more coins`,
        variant: "destructive",
      });
      return;
    }

    const success = await spendCoins(item.price, `Purchased ${item.name}`, coupleId);
    if (success) {
      await purchaseGradient(gradientId);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/shop")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back') || 'Back'}
            </Button>
            
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary">{coins}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('accessories') || 'Accessories'}
          </h1>
          <p className="text-muted-foreground">
            {t('customizeYourProfileGradients') || 'Customize your profile with beautiful gradient themes'}
          </p>
        </div>

        {purchasedGradients.length > 1 && (
          <GradientSelector
            purchasedGradients={purchasedGradients}
            activeGradient={activeGradient}
            onSelectGradient={setGradient}
          />
        )}

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {t('availableGradients') || 'Available Gradients'}
          </h3>
          
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">
              {t('loading') || 'Loading...'}
            </p>
          ) : gradients.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {t('noGradientsAvailable') || 'No gradients available at this time'}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {gradients.map((item) => {
                const gradientId = getGradientIdFromName(item.name);
                const gradient = GRADIENTS[gradientId];
                const isPurchased = purchasedGradients.includes(gradientId);

                return (
                  <Card key={item.id} className="overflow-hidden">
                    <div
                      className="h-32 w-full"
                      style={{ background: gradient.css }}
                    />
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-card-foreground">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-primary" />
                          <span className="font-bold text-lg text-foreground">
                            {item.price}
                          </span>
                        </div>

                        {isPurchased ? (
                          <Button disabled className="gap-2">
                            <Check className="w-4 h-4" />
                            {t('owned') || 'Owned'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handlePurchase(item)}
                            disabled={coins < item.price}
                            className="gap-2"
                          >
                            <Coins className="w-4 h-4" />
                            {t('purchase') || 'Purchase'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
