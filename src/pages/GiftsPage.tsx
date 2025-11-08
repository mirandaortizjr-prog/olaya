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

const flowerImages: { [key: string]: string } = {
  'flower-bouquet-1': flowerBouquet1,
  'flower-bouquet-2': flowerBouquet2,
  'flower-bouquet-3': flowerBouquet3,
  'flower-bouquet-4': flowerBouquet4,
  'flower-bouquet-5': flowerBouquet5,
  'flower-bouquet-6': flowerBouquet6,
  'flower-bouquet-7': flowerBouquet7,
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

  const handlePurchase = (gift: ShopItem) => {
    if (coins < gift.price) {
      toast.error("Not enough coins! Buy more to send this gift.");
      return;
    }
    toast.success(`Purchasing ${gift.name}...`);
    // TODO: Implement actual purchase logic
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
                <div className="aspect-square bg-accent/20 relative">
                  <img
                    src={flowerImages[gift.image_url]}
                    alt={gift.name}
                    className="w-full h-full object-contain p-4"
                  />
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
