import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Heart, Eye } from 'lucide-react';
import { useTogetherCoins } from '@/hooks/useTogetherCoins';
import { toast } from '@/hooks/use-toast';
import togetherCoinsIcon from '@/assets/together-coins-icon.png';
import { VisualEffectsRenderer } from '@/components/VisualEffectsRenderer';

interface VisualEffect {
  id: string;
  name: string;
  effect_type: string;
  animation: string;
  behavior: string;
  category: string;
  price: number;
  preview_enabled: boolean;
}

export default function VisualEffectsShop() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [coupleId, setCoupleId] = useState<string>('');
  const [objectEffects, setObjectEffects] = useState<VisualEffect[]>([]);
  const [phraseEffects, setPhraseEffects] = useState<VisualEffect[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewEffect, setPreviewEffect] = useState<VisualEffect | null>(null);
  const { coins, spendCoins } = useTogetherCoins(user?.id);

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

    const fetchEffects = async () => {
      const { data } = await supabase
        .from('visual_effects')
        .select('*')
        .order('name');

      if (data) {
        setObjectEffects(data.filter(e => e.category === 'objects'));
        setPhraseEffects(data.filter(e => e.category === 'phrases'));
      }
      setLoading(false);
    };

    getUser();
    fetchEffects();
  }, []);

  const handlePurchase = async (effect: VisualEffect) => {
    if (!user || !coupleId) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase effects",
        variant: "destructive",
      });
      return;
    }

    if (coins < effect.price) {
      toast({
        title: "Insufficient coins",
        description: `You need ${effect.price} coins to purchase this effect`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Spend coins
      await spendCoins(effect.price, `Purchased ${effect.name}`, coupleId);

      // Record purchase
      const { error: purchaseError } = await supabase
        .from('purchased_effects')
        .insert({
          user_id: user.id,
          couple_id: coupleId,
          effect_id: effect.id,
        });

      if (purchaseError) throw purchaseError;

      // Auto-activate effect (24h duration)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: activateError } = await supabase
        .from('active_effects')
        .insert({
          couple_id: coupleId,
          effect_id: effect.id,
          activated_by: user.id,
          expires_at: expiresAt.toISOString(),
        });

      if (activateError) throw activateError;

      toast({
        title: "Effect purchased & activated! ✨",
        description: `${effect.name} will be active for 24 hours`,
      });
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (effect: VisualEffect) => {
    setPreviewEffect(effect);
    toast({
      title: "Preview started ✨",
      description: "Effect will play for 10 seconds",
    });

    setTimeout(() => {
      setPreviewEffect(null);
    }, 10000);
  };

  const getEffectIcon = (type: string) => {
    return type === 'phrase' ? <Heart className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
            <h1 className="text-xl font-semibold text-foreground">Visual Effects</h1>
            <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border">
              <img src={togetherCoinsIcon} alt="Coins" className="w-5 h-5" />
              <span className="text-sm font-medium">{coins}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading effects...</div>
        ) : (
          <>
            {/* Romantic Objects */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground mb-1">Romantic Objects</h2>
                <p className="text-sm text-muted-foreground">
                  Beautiful falling objects that create a magical atmosphere for 24 hours
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {objectEffects.map((effect) => (
                  <Card
                    key={effect.id}
                    className="bg-card border-border hover:bg-accent transition-all p-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-center h-16 text-primary">
                        {getEffectIcon(effect.effect_type)}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground text-sm mb-1">{effect.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{effect.behavior}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePreview(effect)}
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handlePurchase(effect)}
                          disabled={coins < effect.price}
                          className="flex-1"
                          size="sm"
                        >
                          <img src={togetherCoinsIcon} alt="Coins" className="w-4 h-4 mr-1.5" />
                          {effect.price}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Romantic Phrases */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground mb-1">Romantic Phrases</h2>
                <p className="text-sm text-muted-foreground">
                  Neon-glow phrases that cascade down your screen for 24 hours
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {phraseEffects.map((effect) => (
                  <Card
                    key={effect.id}
                    className="bg-card border-border hover:bg-accent transition-all p-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-center h-16 text-primary">
                        {getEffectIcon(effect.effect_type)}
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground text-sm mb-1">{effect.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{effect.behavior}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePreview(effect)}
                          variant="outline"
                          className="flex-1"
                          size="sm"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handlePurchase(effect)}
                          disabled={coins < effect.price}
                          className="flex-1"
                          size="sm"
                        >
                          <img src={togetherCoinsIcon} alt="Coins" className="w-4 h-4 mr-1.5" />
                          {effect.price}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preview Renderer */}
      {previewEffect && (
        <VisualEffectsRenderer 
          coupleId="" 
          previewEffect={{
            id: 'preview',
            effect_id: previewEffect.id,
            expires_at: new Date(Date.now() + 10000).toISOString(),
            visual_effects: {
              name: previewEffect.name,
              effect_type: previewEffect.effect_type,
              animation: previewEffect.animation,
              behavior: previewEffect.behavior,
            }
          }}
        />
      )}
    </div>
  );
}
