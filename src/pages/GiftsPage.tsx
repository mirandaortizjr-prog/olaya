import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { toast } from "sonner";
import togetherCoinsIcon from "@/assets/together-coins-icon.png";
import flowerBouquet1 from "@/assets/gifts/flower-bouquet-1.png";
import flowerBouquet2 from "@/assets/gifts/flower-bouquet-2.png";
import flowerBouquet3 from "@/assets/gifts/flower-bouquet-3.png";
import flowerBouquet4 from "@/assets/gifts/flower-bouquet-4.png";
import flowerBouquet5 from "@/assets/gifts/flower-bouquet-5.png";
import flowerBouquet6 from "@/assets/gifts/flower-bouquet-6.png";
import flowerBouquet7 from "@/assets/gifts/flower-bouquet-7.png";
import singleRedRose from "@/assets/gifts/single-red-rose.png";
import pinkHeartBox from "@/assets/gifts/pink-heart-box.png";
import redRoseWrap from "@/assets/gifts/red-rose-wrap.png";
import pinkPurpleBouquet from "@/assets/gifts/pink-purple-bouquet.png";
import hotPinkRoseBouquet from "@/assets/gifts/hot-pink-rose-bouquet.png";
import colorfulSpringBouquet from "@/assets/gifts/colorful-spring-bouquet.png";

const flowerImages: { [key: string]: string } = {
  'flower-bouquet-1': flowerBouquet1,
  'flower-bouquet-2': flowerBouquet2,
  'flower-bouquet-3': flowerBouquet3,
  'flower-bouquet-4': flowerBouquet4,
  'flower-bouquet-5': flowerBouquet5,
  'flower-bouquet-6': flowerBouquet6,
  'flower-bouquet-7': flowerBouquet7,
  'single-red-rose': singleRedRose,
  'pink-heart-box': pinkHeartBox,
  'red-rose-wrap': redRoseWrap,
  'pink-purple-bouquet': pinkPurpleBouquet,
  'hot-pink-rose-bouquet': hotPinkRoseBouquet,
  'colorful-spring-bouquet': colorfulSpringBouquet,
};

interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
}

const GiftsPage = () => {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { coins } = useTogetherCoins(user?.id);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('category', 'flowers')
        .order('price', { ascending: true });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast.error("Failed to load gifts");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (gift: ShopItem) => {
    if (coins < gift.price) {
      toast.error("Not enough coins! Buy more to send this gift.");
      return;
    }

    try {
      // Get couple_id
      const { data: coupleData } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', user?.id)
        .single();

      if (!coupleData) {
        toast.error("You need to be in a couple to send gifts");
        return;
      }

      // Insert purchased gift
      const { error: giftError } = await supabase
        .from('purchased_gifts')
        .insert({
          couple_id: coupleData.couple_id,
          sender_id: user.id,
          gift_id: gift.id,
          gift_name: gift.name,
          gift_image: gift.image_url,
        });

      if (giftError) throw giftError;

      // Deduct coins
      const { error: coinError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: user.id,
          couple_id: coupleData.couple_id,
          amount: gift.price,
          transaction_type: 'spent',
          description: `Purchased ${gift.name}`,
        });

      if (coinError) throw coinError;

      toast.success(`${gift.name} sent! 💝`);
    } catch (error) {
      console.error('Error purchasing gift:', error);
      toast.error("Failed to send gift");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/shop')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Flower Gifts</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full">
            <img src={togetherCoinsIcon} alt="Coins" className="w-5 h-5" />
            <span className="font-semibold text-sm">{coins}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <Heart className="w-12 h-12 mx-auto text-primary animate-pulse" />
          <h2 className="text-2xl font-bold text-foreground">Send Love with Flowers</h2>
          <p className="text-muted-foreground">
            Surprise your partner with a beautiful bouquet
          </p>
        </div>

        {/* Gifts Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-accent animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {gifts.map((gift) => (
              <Card
                key={gift.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square bg-accent/20 relative overflow-hidden">
                  {flowerImages[gift.image_url] ? (
                    <img
                      src={flowerImages[gift.image_url]}
                      alt={gift.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-16 h-16 text-muted-foreground opacity-20" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                    <img src={togetherCoinsIcon} alt="Coins" className="w-3 h-3 mr-1" />
                    {gift.price}
                  </Badge>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                    {gift.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {gift.description}
                  </p>
                  <Button
                    onClick={() => handlePurchase(gift)}
                    className="w-full"
                    size="sm"
                    disabled={coins < gift.price}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    {coins < gift.price ? 'Need More Coins' : 'Send Gift'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && gifts.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No gifts available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftsPage;
