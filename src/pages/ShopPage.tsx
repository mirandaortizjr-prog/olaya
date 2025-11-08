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

interface ShopCategory {
  id: string;
  name: string;
  icon: any;
  comingSoon: boolean;
  path: string | null;
}

const shopCategories: ShopCategory[] = [
  { id: 'gifts', name: 'Gifts', icon: Gift, comingSoon: false, path: '/shop/gifts' },
  { id: 'visual-effects', name: 'Visual Effects', icon: Sparkles, comingSoon: true, path: null },
  { id: 'accessories', name: 'Accessories', icon: Palette, comingSoon: true, path: null },
  { id: 'badges', name: 'Badges', icon: Badge, comingSoon: true, path: null },
  { id: 'seasonal', name: 'Seasonal Items', icon: Calendar, comingSoon: true, path: null },
];

export default function ShopPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [coupleId, setCoupleId] = useState<string>('');
  const [coinSheetOpen, setCoinSheetOpen] = useState(false);
  const { coins } = useTogetherCoins(user?.id);

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
    <div className="min-h-screen pb-20" style={{ background: 'var(--hero-bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50" style={{ background: 'var(--hero-bg)' }}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white">Together Coins</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Coin Balance Section */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <Card 
          className="bg-white/5 border-white/10 hover:bg-white/10 transition-all p-6 cursor-pointer"
          onClick={() => setCoinSheetOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={togetherCoinsIcon} alt="Together Coins" className="w-12 h-12" />
              <div>
                <p className="text-sm text-white/70">You have</p>
                <p className="text-2xl font-bold text-white">{coins} Together Coins</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
            >
              Buy More
            </Button>
          </div>
          <p className="text-sm text-white/60 mt-3 text-center">
            {coins >= 50 
              ? "Want to surprise your partner? 💕"
              : "Get coins to send gifts and unlock features"}
          </p>
        </Card>
      </div>

      {/* Shop Categories */}
      <div className="max-w-lg mx-auto px-4 py-2">
        <h2 className="text-lg font-semibold text-white mb-4">Shop Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {shopCategories.map((category) => (
            <Card
              key={category.id}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all p-6 relative cursor-pointer"
              onClick={() => category.path && navigate(category.path)}
            >
              <div className="flex flex-col items-center gap-3">
                <category.icon className="h-10 w-10 text-pink-400" />
                <p className="text-white font-medium text-center">{category.name}</p>
                {category.comingSoon && (
                  <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                    Coming Soon
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
