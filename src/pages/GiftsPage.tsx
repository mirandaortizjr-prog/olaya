import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift as GiftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { toast } from "sonner";
import togetherCoinsIcon from "@/assets/together-coins-icon.png";

// Import flower images
import flower1 from "@/assets/gifts/flower-bouquet-1.png";
import flower2 from "@/assets/gifts/flower-bouquet-2.png";
import flower3 from "@/assets/gifts/flower-bouquet-3.png";
import flower4 from "@/assets/gifts/flower-bouquet-4.png";
import flower5 from "@/assets/gifts/flower-bouquet-5.png";
import flower6 from "@/assets/gifts/flower-bouquet-6.png";
import flower7 from "@/assets/gifts/flower-bouquet-7.png";

const flowerImages: Record<string, string> = {
  "flower-bouquet-1": flower1,
  "flower-bouquet-2": flower2,
  "flower-bouquet-3": flower3,
  "flower-bouquet-4": flower4,
  "flower-bouquet-5": flower5,
  "flower-bouquet-6": flower6,
  "flower-bouquet-7": flower7,
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
  const [userId, setUserId] = useState<string>('');
  const { coins } = useTogetherCoins(userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("*")
        .eq("category", "flowers")
        .order("price", { ascending: true });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error("Error fetching gifts:", error);
      toast.error("Failed to load gifts");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (gift: ShopItem) => {
    if (coins < gift.price) {
      toast.error("Not enough Together Coins");
      return;
    }
    
    toast.success(`${gift.name} added to your gifts! You can send it to your partner soon.`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/shop")}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Flowers</h1>
            <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-full">
              <img src={togetherCoinsIcon} alt="Together Coins" className="w-5 h-5" />
              <span className="font-semibold text-sm">{coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-muted-foreground text-center">
            Want to surprise your partner?
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-3" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {gifts.map((gift) => (
              <Card
                key={gift.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gradient-to-b from-secondary to-background p-4">
                  <img
                    src={flowerImages[gift.image_url]}
                    alt={gift.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{gift.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {gift.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <img
                        src={togetherCoinsIcon}
                        alt="Coins"
                        className="w-4 h-4"
                      />
                      <span className="font-bold text-sm">{gift.price}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(gift)}
                      disabled={coins < gift.price}
                      className="h-8 px-3 text-xs"
                    >
                      <GiftIcon className="h-3 w-3 mr-1" />
                      Buy
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && gifts.length === 0 && (
          <div className="text-center py-12">
            <GiftIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No gifts available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftsPage;
