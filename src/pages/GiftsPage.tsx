import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { toast } from "sonner";
import { format } from "date-fns";
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
import chocolateBar from "@/assets/gifts/chocolate-bar.png";
import heartChocolateBox from "@/assets/gifts/heart-chocolate-box.png";
import giftBoxDeluxe from "@/assets/gifts/gift-box-deluxe.png";
import loveCake from "@/assets/gifts/love-cake.png";
import balloonBear from "@/assets/gifts/balloon-bear.png";
import balloonMonkey from "@/assets/gifts/balloon-monkey.png";
import balloonFlower from "@/assets/gifts/balloon-flower.png";
import balloonUnicorn from "@/assets/gifts/balloon-unicorn.png";
import balloonPacifier from "@/assets/gifts/balloon-pacifier.png";
import balloonSwan from "@/assets/gifts/balloon-swan.png";
import balloonDog from "@/assets/gifts/balloon-dog.png";
import balloonHeartWand from "@/assets/gifts/balloon-heart-wand.png";
import balloonPoodle from "@/assets/gifts/balloon-poodle.png";
import stuffedMonkey from "@/assets/gifts/stuffed-monkey.png";
import stuffedBunny from "@/assets/gifts/stuffed-bunny.png";
import stuffedDog from "@/assets/gifts/stuffed-dog.png";
import stuffedKoala from "@/assets/gifts/stuffed-koala.png";
import stuffedBear from "@/assets/gifts/stuffed-bear.png";
import stuffedTiger from "@/assets/gifts/stuffed-tiger.png";
import stuffedRaccoon from "@/assets/gifts/stuffed-raccoon.png";
import stuffedFox from "@/assets/gifts/stuffed-fox.png";
import stuffedSloth from "@/assets/gifts/stuffed-sloth.png";
import stuffedLion from "@/assets/gifts/stuffed-lion.png";
import stuffedMonkey2 from "@/assets/gifts/stuffed-monkey2.png";
import stuffedKoala2 from "@/assets/gifts/stuffed-koala2.png";
import stuffedMonkey3 from "@/assets/gifts/stuffed-monkey3.png";
import stuffedZebra from "@/assets/gifts/stuffed-zebra.png";
import stuffedPanda from "@/assets/gifts/stuffed-panda.png";
import stuffedSquirrel from "@/assets/gifts/stuffed-squirrel.png";
import stuffedRhino from "@/assets/gifts/stuffed-rhino.png";

const giftImages: { [key: string]: string } = {
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
  'chocolate-bar': chocolateBar,
  'heart-chocolate-box': heartChocolateBox,
  'gift-box-deluxe': giftBoxDeluxe,
  'love-cake': loveCake,
  'balloon-bear': balloonBear,
  'balloon-monkey': balloonMonkey,
  'balloon-flower': balloonFlower,
  'balloon-unicorn': balloonUnicorn,
  'balloon-pacifier': balloonPacifier,
  'balloon-swan': balloonSwan,
  'balloon-dog': balloonDog,
  'balloon-heart-wand': balloonHeartWand,
  'balloon-poodle': balloonPoodle,
  'stuffed-monkey': stuffedMonkey,
  'stuffed-bunny': stuffedBunny,
  'stuffed-dog': stuffedDog,
  'stuffed-koala': stuffedKoala,
  'stuffed-bear': stuffedBear,
  'stuffed-tiger': stuffedTiger,
  'stuffed-raccoon': stuffedRaccoon,
  'stuffed-fox': stuffedFox,
  'stuffed-sloth': stuffedSloth,
  'stuffed-lion': stuffedLion,
  'stuffed-monkey2': stuffedMonkey2,
  'stuffed-koala2': stuffedKoala2,
  'stuffed-monkey3': stuffedMonkey3,
  'stuffed-zebra': stuffedZebra,
  'stuffed-panda': stuffedPanda,
  'stuffed-squirrel': stuffedSquirrel,
  'stuffed-rhino': stuffedRhino,
};

interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
}

interface PurchasedGiftHistory {
  id: string;
  gift_name: string;
  gift_image: string;
  purchased_at: string;
}

const GiftsPage = () => {
  const navigate = useNavigate();
  const [flowerGifts, setFlowerGifts] = useState<ShopItem[]>([]);
  const [sweetGifts, setSweetGifts] = useState<ShopItem[]>([]);
  const [balloonGifts, setBalloonGifts] = useState<ShopItem[]>([]);
  const [stuffedAnimalGifts, setStuffedAnimalGifts] = useState<ShopItem[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchasedGiftHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [balloonCollectionComplete, setBalloonCollectionComplete] = useState(false);
  const [stuffedCollectionComplete, setStuffedCollectionComplete] = useState(false);
  const { coins } = useTogetherCoins(user?.id);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchPurchaseHistory(user.id);
      }
    };
    getUser();
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data: flowersData, error: flowersError } = await supabase
        .from('shop_items')
        .select('*')
        .eq('category', 'flowers')
        .order('price', { ascending: true });

      if (flowersError) throw flowersError;
      setFlowerGifts(flowersData || []);

      const { data: sweetsData, error: sweetsError } = await supabase
        .from('shop_items')
        .select('*')
        .eq('category', 'sweets')
        .order('price', { ascending: true });

      if (sweetsError) throw sweetsError;
      setSweetGifts(sweetsData || []);

      const { data: balloonsData, error: balloonsError } = await supabase
        .from('shop_items')
        .select('*')
        .eq('category', 'balloons')
        .order('price', { ascending: true });

      if (balloonsError) throw balloonsError;
      setBalloonGifts(balloonsData || []);

      const { data: stuffedData, error: stuffedError } = await supabase
        .from('shop_items')
        .select('*')
        .eq('category', 'stuffed-animals')
        .order('price', { ascending: true });

      if (stuffedError) throw stuffedError;
      setStuffedAnimalGifts(stuffedData || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast.error("Failed to load gifts");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchased_gifts')
        .select('id, gift_name, gift_image, purchased_at')
        .eq('sender_id', userId)
        .order('purchased_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPurchaseHistory(data || []);

      // Check if balloon collection is complete
      if (data && balloonGifts.length > 0) {
        const balloonImageNames = balloonGifts.map(g => g.image_url);
        const purchasedBalloons = data.filter(p => balloonImageNames.includes(p.gift_image));
        if (purchasedBalloons.length === balloonGifts.length && !balloonCollectionComplete) {
          await awardCollectionBonus(userId, 'balloon', 100);
        }
      }

      // Check if stuffed animal collection is complete
      if (data && stuffedAnimalGifts.length > 0) {
        const stuffedImageNames = stuffedAnimalGifts.map(g => g.image_url);
        const purchasedStuffed = data.filter(p => stuffedImageNames.includes(p.gift_image));
        if (purchasedStuffed.length === stuffedAnimalGifts.length && !stuffedCollectionComplete) {
          await awardCollectionBonus(userId, 'stuffed', 500);
        }
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    }
  };

  const awardCollectionBonus = async (userId: string, collectionType: string, bonusAmount: number) => {
    try {
      const { data: coupleData } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', userId)
        .single();

      if (!coupleData) return;

      const description = collectionType === 'balloon' 
        ? 'Balloon Collection Complete! 🎈' 
        : 'Stuffed Animal Collection Complete! 🧸';

      const { error } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: userId,
          couple_id: coupleData.couple_id,
          amount: bonusAmount,
          transaction_type: 'earn',
          description,
        });

      if (!error) {
        if (collectionType === 'balloon') {
          setBalloonCollectionComplete(true);
        } else {
          setStuffedCollectionComplete(true);
        }
        toast.success(`🎉 Collection Complete! You earned ${bonusAmount} bonus coins!`);
      }
    } catch (error) {
      console.error('Error awarding collection bonus:', error);
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

      // Deduct coins: use positive amount with transaction_type 'spend'
      const { error: coinError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: user.id,
          couple_id: coupleData.couple_id,
          amount: gift.price,
          transaction_type: 'spend',
          description: `Purchased ${gift.name}`,
        });

      if (coinError) throw coinError;

      toast.success(`${gift.name} sent! 💝`);
      
      // Refresh purchase history
      if (user) {
        fetchPurchaseHistory(user.id);
      }
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
          <h1 className="text-xl font-semibold text-foreground">Gifts</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full">
            <img src={togetherCoinsIcon} alt="Coins" className="w-5 h-5" />
            <span className="font-semibold text-sm">{coins}</span>
          </div>
        </div>
      </div>

      {/* Tabs for Gift Categories and History */}
      <Tabs defaultValue="flowers" className="p-4">
        <TabsList className="w-full grid grid-cols-5 gap-1">
          <TabsTrigger value="flowers" className="text-xs px-2">
            <Heart className="w-3 h-3 mr-1" />
            Flowers
          </TabsTrigger>
          <TabsTrigger value="sweets" className="text-xs px-2">
            🍫 Sweets
          </TabsTrigger>
          <TabsTrigger value="balloons" className="text-xs px-2">
            🎈 Balloons
          </TabsTrigger>
          <TabsTrigger value="stuffed" className="text-xs px-2">
            🧸 Plush
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs px-2">
            <History className="w-3 h-3 mr-1" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flowers" className="space-y-6 mt-6">
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
              {flowerGifts.map((gift) => (
                <Card
                  key={gift.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-square bg-accent/20 relative overflow-hidden">
                    {giftImages[gift.image_url] ? (
                      <img
                        src={giftImages[gift.image_url]}
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
          {!loading && flowerGifts.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No flower gifts available yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sweets" className="space-y-6 mt-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="text-5xl mx-auto">🍫</div>
            <h2 className="text-2xl font-bold text-foreground">Sweet Treats</h2>
            <p className="text-muted-foreground">
              Send delicious sweets to make their day special
            </p>
          </div>

          {/* Sweets Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-accent animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {sweetGifts.map((gift) => (
                <Card
                  key={gift.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-square bg-accent/20 relative overflow-hidden">
                    {giftImages[gift.image_url] ? (
                      <img
                        src={giftImages[gift.image_url]}
                        alt={gift.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        🍫
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
          {!loading && sweetGifts.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl">🍫</div>
              <p className="text-muted-foreground">No sweet gifts available yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="balloons" className="space-y-6 mt-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="text-5xl mx-auto">🎈</div>
            <h2 className="text-2xl font-bold text-foreground">Balloon Collection</h2>
            <p className="text-muted-foreground">
              Collect all balloon figures to earn 100 bonus coins!
            </p>
            {balloonGifts.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-semibold text-primary">
                  {purchaseHistory.filter(p => balloonGifts.map(g => g.image_url).includes(p.gift_image)).length} / {balloonGifts.length}
                </span>
              </div>
            )}
          </div>

          {/* Balloons Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-accent animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {balloonGifts.map((gift) => {
                const isCollected = purchaseHistory.some(p => p.gift_image === gift.image_url);
                return (
                  <Card
                    key={gift.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 relative"
                  >
                    {isCollected && (
                      <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        ✓ Collected
                      </div>
                    )}
                    <div className="aspect-square bg-accent/20 relative overflow-hidden">
                      {giftImages[gift.image_url] ? (
                        <img
                          src={giftImages[gift.image_url]}
                          alt={gift.name}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          🎈
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
                        disabled={coins < gift.price || isCollected}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {isCollected ? 'Collected' : coins < gift.price ? 'Need More Coins' : 'Send Gift'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && balloonGifts.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl">🎈</div>
              <p className="text-muted-foreground">No balloon gifts available yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stuffed" className="space-y-6 mt-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="text-5xl mx-auto">🧸</div>
            <h2 className="text-2xl font-bold text-foreground">Stuffed Animal Collection</h2>
            <p className="text-muted-foreground">
              Collect all stuffed animals to earn 500 bonus coins!
            </p>
            {stuffedAnimalGifts.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-semibold text-primary">
                  {purchaseHistory.filter(p => stuffedAnimalGifts.map(g => g.image_url).includes(p.gift_image)).length} / {stuffedAnimalGifts.length}
                </span>
              </div>
            )}
          </div>

          {/* Stuffed Animals Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-accent animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {stuffedAnimalGifts.map((gift) => {
                const isCollected = purchaseHistory.some(p => p.gift_image === gift.image_url);
                return (
                  <Card
                    key={gift.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 relative"
                  >
                    {isCollected && (
                      <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        ✓ Collected
                      </div>
                    )}
                    <div className="aspect-square bg-accent/20 relative overflow-hidden">
                      {giftImages[gift.image_url] ? (
                        <img
                          src={giftImages[gift.image_url]}
                          alt={gift.name}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          🧸
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
                        disabled={coins < gift.price || isCollected}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {isCollected ? 'Collected' : coins < gift.price ? 'Need More Coins' : 'Send Gift'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && stuffedAnimalGifts.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl">🧸</div>
              <p className="text-muted-foreground">No stuffed animal gifts available yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {/* Purchase History */}
          {purchaseHistory.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <History className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No gifts sent yet</p>
              <p className="text-sm text-muted-foreground">
                Your gift history will appear here after you send gifts
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {purchaseHistory.map((gift) => (
                <Card key={gift.id} className="p-4">
                  <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {giftImages[gift.gift_image] ? (
                        <img
                          src={giftImages[gift.gift_image]}
                          alt={gift.gift_name}
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <Heart className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {gift.gift_name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Sent on {format(new Date(gift.purchased_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GiftsPage;
