import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Coins, Sparkles, ArrowLeft, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useInAppPurchase } from '@/hooks/useInAppPurchase';
import { PRODUCT_IDS } from '@/utils/inAppPurchases';
import olayaLogo from '@/assets/olaya-logo-v2.png';

const InAppPurchasePage = () => {
  const [userId, setUserId] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isInitialized, isPremium, products, isLoading, purchase, restore } = useInAppPurchase(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    checkAuth();
  }, []);

  const liteFeatures = [
    "Home Feed and Quick Actions",
    "Flirts & Mood Sharing",
    "Desires Menu",
    "Love Meter & Countdown",
    "Full Store Access",
    "Journals & Messaging",
    "Profile Customization",
    "Music Player",
    "Media Sharing",
    "Gift System",
    "Visual Effects",
  ];

  const premiumFeatures = [
    "How Well Do You Know Me",
    "Love Language Decoder",
    "Would You Rather",
    "Future Forecast",
    "Truth or Tender",
    "Memory Lane Match",
    "Private Photos & Videos",
    "Fantasies",
    "Private Journal",
    "Biometric Lock",
  ];

  const handlePurchase = async (productId: string) => {
    if (!userId) {
      toast({
        title: 'Not Authenticated',
        description: 'Please sign in to make a purchase',
        variant: 'destructive',
      });
      return;
    }

    await purchase(productId as any);
  };

  const handleRestore = async () => {
    if (!userId) {
      toast({
        title: 'Not Authenticated',
        description: 'Please sign in to restore purchases',
        variant: 'destructive',
      });
      return;
    }

    await restore();
  };

  // Get pricing from products or use defaults
  const premiumProduct = products.find(p => p.productId === PRODUCT_IDS.PREMIUM_MONTHLY);
  const trialProduct = products.find(p => p.productId === PRODUCT_IDS.PREMIUM_TRIAL);

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto pb-20">
      {/* Header */}
      <div className="pt-4 pb-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRestore}
            disabled={isLoading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Restore
          </Button>
        </div>
        
        <div className="text-center">
          <img 
            src={olayaLogo} 
            alt="Olaya Together" 
            className="h-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">
            {isPremium ? 'You Have Premium!' : 'Upgrade to Premium'}
          </h1>
          <p className="text-muted-foreground">
            {isPremium 
              ? 'Enjoy all premium features'
              : 'Unlock the full emotional experience for couples'
            }
          </p>
        </div>
      </div>

      {!isInitialized && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <Card className="p-4 bg-yellow-500/10 border-yellow-500/50">
            <p className="text-sm text-yellow-200 text-center">
              ℹ️ In-app purchases are only available on mobile devices (iOS/Android).
              For web preview, you can still browse the plans.
            </p>
          </Card>
        </div>
      )}

      {isPremium && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <Card className="p-4 bg-green-500/10 border-green-500/50">
            <p className="text-sm text-green-200 text-center font-semibold">
              ✅ You have an active Premium subscription
            </p>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Lite Version */}
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground mb-1">Lite Version</h2>
            <p className="text-lg font-semibold text-primary">Free Forever</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Enjoy the essentials of connection, personalization, and shared intimacy.
          </p>
          <div className="grid md:grid-cols-2 gap-2">
            {liteFeatures.map((feature, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/90">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Premium Plan */}
        <Card className="p-6 bg-gradient-to-br from-amber-950/30 via-card/50 to-card/50 backdrop-blur border-2 border-amber-500/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 pointer-events-none" />
          
          <div className="relative">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">Premium</h2>
                <span className="px-2 py-1 bg-primary rounded-full text-xs font-semibold">
                  MOST POPULAR
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg text-muted-foreground line-through">$18.99</span>
                <span className="text-3xl font-bold text-amber-400">
                  {premiumProduct?.price || '$12.99'}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">
                  + 500 Coin Start Bonus (Limited Time!)
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <p className="text-sm font-semibold text-foreground mb-3">
              Unlock everything — Games, Private Vault & More:
            </p>
            <div className="grid md:grid-cols-2 gap-2 mb-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/90">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold"
              onClick={() => handlePurchase(PRODUCT_IDS.PREMIUM_MONTHLY)}
              disabled={isLoading || isPremium}
            >
              {isLoading ? 'Processing...' : isPremium ? 'Active' : 'Get Premium Now'}
            </Button>
          </div>
        </Card>

        {/* 3-Day Free Trial */}
        <Card className="p-6 bg-card/50 backdrop-blur border-primary/50">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground mb-1">3-Day Free Trial</h2>
            <p className="text-lg font-semibold text-primary">Try Premium Free</p>
          </div>
          
          <ul className="space-y-2 mb-4">
            <li className="flex gap-2 items-start">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">Instant access to all Premium features</span>
            </li>
            <li className="flex gap-2 items-start">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">Cancel anytime before the 3rd day — no charge</span>
            </li>
            <li className="flex gap-2 items-start">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">Auto-renews at {premiumProduct?.price || '$12.99'}/month after trial</span>
            </li>
          </ul>

          <Button 
            className="w-full"
            variant="outline"
            onClick={() => handlePurchase(PRODUCT_IDS.PREMIUM_TRIAL)}
            disabled={isLoading || isPremium}
          >
            {isLoading ? 'Processing...' : isPremium ? 'Active' : 'Start Free Trial'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default InAppPurchasePage;
