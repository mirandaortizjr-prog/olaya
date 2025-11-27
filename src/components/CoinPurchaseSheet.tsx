import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Sparkles } from 'lucide-react';
import { useTogetherCoins } from '@/hooks/useTogetherCoins';
import { useToast } from '@/hooks/use-toast';
import { usePlatform } from '@/hooks/usePlatform';
import { useInAppPurchase } from '@/hooks/useInAppPurchase';
import { PRODUCT_IDS } from '@/utils/inAppPurchases';
import togetherCoinsIcon from '@/assets/together-coins-icon.png';

interface CoinPack {
  coins: number;
  price: string;
  productId?: string;
}

const coinPacks: CoinPack[] = [
  { coins: 100, price: '$1.99', productId: PRODUCT_IDS.COIN_PACK_100 },
  { coins: 500, price: '$4.99', productId: PRODUCT_IDS.COIN_PACK_500 },
  { coins: 1000, price: '$9.99', productId: PRODUCT_IDS.COIN_PACK_1000 },
];

interface CoinPurchaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | undefined;
  coupleId: string;
  currentCoins: number;
}

export default function CoinPurchaseSheet({
  open,
  onOpenChange,
  userId,
  coupleId,
  currentCoins,
}: CoinPurchaseSheetProps) {
  const { toast } = useToast();
  const { addCoins } = useTogetherCoins(userId);
  const platform = usePlatform();
  const { purchase } = useInAppPurchase(userId || '');

  const handlePurchase = async (pack: CoinPack) => {
    if (!userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make purchases",
        variant: "destructive",
      });
      return;
    }

    if (platform.isDespia && pack.productId) {
      // Use in-app purchase for Despia
      await purchase(pack.productId as any);
    } else {
      // Use Stripe for web (placeholder - implement Stripe checkout)
      toast({
        title: "Coming Soon",
        description: "Stripe checkout for coins will be available soon",
      });
      // TODO: Implement Stripe checkout for coin purchases
    }
    
    onOpenChange(false);
  };

  const getPackDescription = (coins: number) => {
    if (coins >= 1000) return "Perfect for spoiling your partner";
    if (coins >= 500) return "Great for special surprises";
    return "Just enough to send a sweet gift";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]" style={{ background: 'var(--hero-bg)' }}>
        <SheetHeader>
          <SheetTitle className="text-white text-center">Together Coins</SheetTitle>
        </SheetHeader>

        {/* Current Balance */}
        <div className="mt-6">
          <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-1">Your Balance</p>
                <p className="text-3xl font-bold text-white flex items-center gap-2">
                  <img src={togetherCoinsIcon} alt="Together Coins" className="w-8 h-8" />
                  {currentCoins}
                </p>
                <p className="text-sm text-white/60 mt-2">
                  {currentCoins >= 50 
                    ? "Ready to send some love! 💕"
                    : "Get more coins to surprise your partner"}
                </p>
              </div>
              <Sparkles className="h-12 w-12 text-pink-400 animate-pulse" />
            </div>
          </Card>
        </div>

        {/* Coin Packs */}
        <div className="mt-6 overflow-y-auto max-h-[calc(85vh-280px)]">
          <h2 className="text-lg font-semibold text-white mb-4">Get More Coins</h2>
          <div className="space-y-3 pb-6">
            {coinPacks.map((pack, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={togetherCoinsIcon} alt="Coins" className="w-10 h-10" />
                    <div>
                      <p className="text-lg font-bold text-white">{pack.coins} Coins</p>
                      <p className="text-sm text-white/60">{getPackDescription(pack.coins)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePurchase(pack)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold"
                  >
                    {pack.price}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="bg-white/5 border-white/10 p-4 mt-4 mb-6">
            <p className="text-sm text-white/70 text-center leading-relaxed">
              Together Coins let you send virtual gifts, unlock special features, and show your partner how much you care. Every coin spent strengthens your connection. 💝
            </p>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
