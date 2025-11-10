import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Coins, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import olayaLogo from '@/assets/olaya-logo-v2.png';

type PlanType = 'lite' | 'premium' | 'trial';

const PremiumPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const liteFeatures = [
    "Home Feed and Quick Actions",
    "Flirts (Instant, Emoji, Custom)",
    "Mood and Status Sharing",
    "Desires Menu",
    "Love Meter and Anniversary Countdown",
    "Full Store Access (Gifts, Effects, Skins, Coins)",
    "Journals (Shared, Intimate, \"Our Journal\")",
    "Messaging (Chat, Media, Emoji, Read Receipts)",
    "Profile Customization (Picture, Nickname, Gender, Bio, Birthday, Location)",
    "Couple Settings (Name, Shared Photo, Anniversary, Songs, Background)",
    "Theme Settings (Color Palette, Language, Dark/Light Mode)",
    "Music Player (YouTube Playlist)",
    "Media Sharing (Gallery, Journal, Chat)",
    "Gift System (Send, Animate, Track)",
    "Visual Effects and Seasonal Animations",
    "Progress Tracking (Days Together, Gifts, Journal Count)",
    "Security (Privacy Password, Couple-Only Access)"
  ];

  const premiumFeatures = [
    "How Well Do You Know Me",
    "Love Language Decoder",
    "Would You Rather",
    "Future Forecast",
    "Truth or Tender",
    "Memory Lane Match",
    "Daily Sync",
    "Private Photos",
    "Private Videos",
    "Fantasies",
    "Private Journal",
    "Biometric Lock",
    "Real-Time Sharing Notifications",
    "Selective Sharing Toggle",
    "Custom Vault Title"
  ];

  const handleStartLite = async () => {
    setIsLoading(true);
    try {
      navigate('/auth');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (plan: PlanType) => {
    setSelectedPlan(plan);
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (plan === 'premium' || plan === 'trial') {
        toast({
          title: plan === 'trial' ? '3-Day Free Trial Selected' : 'Premium Plan Selected',
          description: 'Please sign up or log in to continue',
        });
        
        setTimeout(() => {
          navigate('/auth');
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process plan selection',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto pb-20">
      {/* Header with Logo */}
      <div className="pt-8 pb-6 text-center">
        <img 
          src={olayaLogo} 
          alt="Olaya Together" 
          className="h-20 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">Upgrade to Premium</h1>
        <p className="text-muted-foreground">Unlock the full emotional experience for couples.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Lite Version */}
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Lite Version</h2>
              <p className="text-lg font-semibold text-primary">Free Forever</p>
            </div>
            <div 
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                selectedPlan === 'lite' 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground'
              }`}
              onClick={() => setSelectedPlan('lite')}
            >
              {selectedPlan === 'lite' && <Check className="w-4 h-4 text-primary-foreground" />}
            </div>
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

        {/* Premium Plan - Glowing */}
        <Card className="p-6 bg-gradient-to-br from-amber-950/30 via-card/50 to-card/50 backdrop-blur border-2 border-amber-500/50 relative overflow-hidden animate-pulse-glow">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 animate-shimmer pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">Premium</h2>
                  <span className="px-2 py-1 bg-primary rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg text-muted-foreground line-through">$18.99</span>
                  <span className="text-3xl font-bold text-amber-400">$12.99</span>
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
              <div 
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                  selectedPlan === 'premium' 
                    ? 'border-amber-400 bg-amber-400' 
                    : 'border-muted-foreground'
                }`}
                onClick={() => setSelectedPlan('premium')}
              >
                {selectedPlan === 'premium' && <Check className="w-4 h-4 text-black" />}
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
              onClick={() => handleSelectPlan('premium')}
              disabled={isLoading}
            >
              {isLoading && selectedPlan === 'premium' ? 'Processing...' : 'Get Premium Now'}
            </Button>
          </div>
        </Card>

        {/* 3-Day Free Trial */}
        <Card className="p-6 bg-card/50 backdrop-blur border-primary/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">3-Day Free Trial</h2>
              <p className="text-lg font-semibold text-primary">Try Premium Free</p>
            </div>
            <div 
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                selectedPlan === 'trial' 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground'
              }`}
              onClick={() => setSelectedPlan('trial')}
            >
              {selectedPlan === 'trial' && <Check className="w-4 h-4 text-primary-foreground" />}
            </div>
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
              <span className="text-sm">If not cancelled, $12.99 auto-charged for one month</span>
            </li>
            <li className="flex gap-2 items-start">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">No refunds after trial ends</span>
            </li>
            <li className="flex gap-2 items-start">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">Subscription ends automatically after one month unless renewed</span>
            </li>
          </ul>

          <Button 
            className="w-full"
            variant="outline"
            onClick={() => handleSelectPlan('trial')}
            disabled={isLoading}
          >
            {isLoading && selectedPlan === 'trial' ? 'Processing...' : 'Start Free Trial'}
          </Button>
        </Card>

        {/* Continue with Lite */}
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-3">
            Not ready for premium? No problem!
          </p>
          <Button 
            variant="ghost"
            className="text-foreground hover:text-primary"
            onClick={handleStartLite}
            disabled={isLoading}
          >
            Continue with Lite — Let's Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPlansPage;
