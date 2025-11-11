import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, Sparkles, Palette, Badge, Calendar } from 'lucide-react';
import { useTogetherCoins } from '@/hooks/useTogetherCoins';
import togetherCoinsIcon from '@/assets/together-coins-icon.png';
import CoinPurchaseSheet from '@/components/CoinPurchaseSheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

interface ShopCategory {
  id: string;
  nameKey: string;
  icon: any;
  comingSoon: boolean;
  path: string | null;
}

export default function ShopPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [user, setUser] = useState<User | null>(null);
  const [coupleId, setCoupleId] = useState<string>('');
  const [coinSheetOpen, setCoinSheetOpen] = useState(false);
  const { coins } = useTogetherCoins(user?.id);

  const shopCategories: ShopCategory[] = [
    { id: 'gifts', nameKey: 'shopGifts', icon: Gift, comingSoon: false, path: '/shop/gifts' },
    { id: 'visual-effects', nameKey: 'shopVisualEffects', icon: Sparkles, comingSoon: false, path: '/shop/visual-effects' },
    { id: 'accessories', nameKey: 'shopAccessories', icon: Palette, comingSoon: false, path: '/shop/accessories' },
    { id: 'badges', nameKey: 'shopBadges', icon: Badge, comingSoon: true, path: null },
    { id: 'seasonal', nameKey: 'shopSeasonalItems', icon: Calendar, comingSoon: true, path: null },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
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

    getUser();
  }, []);
  return (
    <div className="min-h-screen bg-background pb-20 overscroll-contain">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">{t.shopTitle}</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Coin Balance Section */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <Card 
          className="bg-card border-border hover:bg-accent transition-all p-6 cursor-pointer"
          onClick={() => setCoinSheetOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={togetherCoinsIcon} alt="Together Coins" className="w-12 h-12" />
              <div>
                <p className="text-sm text-muted-foreground">{t.shopYouHave}</p>
                <p className="text-2xl font-bold text-foreground">{coins} {t.shopTogetherCoins}</p>
              </div>
            </div>
            <Button>
              {t.shopBuyMore}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {coins >= 50 ? t.shopSurprise : t.shopGetCoins}
          </p>
        </Card>
      </div>

      {/* Shop Categories */}
      <div className="max-w-lg mx-auto px-4 py-2">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t.shopCategories}</h2>
        <div className="grid grid-cols-2 gap-3">
          {shopCategories.map((category) => (
            <Card
              key={category.id}
              className="bg-card border-border hover:bg-accent transition-all p-6 relative cursor-pointer"
              onClick={() => category.path && navigate(category.path)}
            >
              <div className="flex flex-col items-center gap-3">
                <category.icon className="h-10 w-10 text-primary" />
                <p className="text-foreground font-medium text-center">{t[category.nameKey]}</p>
                {category.comingSoon && (
                  <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">
                    {t.shopComingSoon}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Coin Purchase Sheet */}
      <CoinPurchaseSheet
        open={coinSheetOpen}
        onOpenChange={setCoinSheetOpen}
        userId={user?.id}
        coupleId={coupleId}
        currentCoins={coins}
      />
    </div>
  );
}
