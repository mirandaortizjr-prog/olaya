import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTogetherCoins } from '@/hooks/useTogetherCoins';
import togetherCoinsIcon from '@/assets/together-coins-icon.png';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

// Potion images
import lovePotionRed from '@/assets/potions/love-potion-red.png';
import desirePotionBlue from '@/assets/potions/desire-potion-blue.png';
import lustPotionPurple from '@/assets/potions/lust-potion-purple.png';
import friendshipPotionGreen from '@/assets/potions/friendship-potion-green.png';
import lustfulFriendsPotion from '@/assets/potions/lustful-friends-potion.png';
import passionPotionOrange from '@/assets/potions/passion-potion-orange.png';
import joyPotionYellow from '@/assets/potions/joy-potion-yellow.png';
import starlightPotion from '@/assets/potions/starlight-potion.png';
import romancePotionPink from '@/assets/potions/romance-potion-pink.png';

const potionImages: { [key: string]: string } = {
  'love-potion-red': lovePotionRed,
  'desire-potion-blue': desirePotionBlue,
  'lust-potion-purple': lustPotionPurple,
  'friendship-potion-green': friendshipPotionGreen,
  'lustful-friends-potion': lustfulFriendsPotion,
  'passion-potion-orange': passionPotionOrange,
  'joy-potion-yellow': joyPotionYellow,
  'starlight-potion': starlightPotion,
  'romance-potion-pink': romancePotionPink,
};

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function PotionsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [userId, setUserId] = useState<string>('');
  const [coupleId, setCoupleId] = useState<string>('');
  const [potions, setPotions] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { coins, spendCoins } = useTogetherCoins(userId);

  useEffect(() => {
    fetchUserData();
    fetchPotions();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data: memberData } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', user.id)
        .single();

      if (memberData) {
        setCoupleId(memberData.couple_id);
      }
    }
  };

  const fetchPotions = async () => {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('category', 'potions')
      .order('price', { ascending: false });

    if (error) {
      console.error('Error fetching potions:', error);
      toast.error('Failed to load potions');
    } else {
      setPotions(data || []);
    }
    setLoading(false);
  };

  const handlePurchase = async (potion: ShopItem) => {
    if (!userId || !coupleId) {
      toast.error('Please sign in to purchase potions');
      return;
    }

    if (coins < potion.price) {
      toast.error('Not enough Together Coins');
      return;
    }

    try {
      // Spend coins
      await spendCoins(potion.price, `Purchased ${potion.name}`, coupleId);

      // Record the purchase
      const { error: purchaseError } = await supabase
        .from('gift_transactions')
        .insert({
          item_id: potion.id,
          sender_id: userId,
          receiver_id: userId,
          couple_id: coupleId,
          message: `Used ${potion.name}`
        });

      if (purchaseError) throw purchaseError;

      toast.success(`${potion.name} purchased! ✨`);
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to complete purchase');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 overscroll-contain">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/shop')}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Magical Potions</h1>
            <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full">
              <img src={togetherCoinsIcon} alt="Coins" className="w-5 h-5" />
              <span className="text-sm font-semibold text-foreground">{coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Potions Grid */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-muted-foreground text-center mb-6">
          Choose from our collection of magical potions to enhance your relationship
        </p>
        
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading potions...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {potions.map((potion) => (
              <Card 
                key={potion.id} 
                className="bg-card border-border overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square bg-muted/20 p-4 flex items-center justify-center">
                  <img
                    src={potionImages[potion.image_url]}
                    alt={potion.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 min-h-[2.5rem]">
                      {potion.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {potion.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1">
                      <img src={togetherCoinsIcon} alt="Coins" className="w-4 h-4" />
                      <span className="font-bold text-foreground">{potion.price}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(potion)}
                      disabled={coins < potion.price}
                      className="text-xs"
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
