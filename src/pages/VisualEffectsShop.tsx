import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import { useTogetherCoins } from '@/hooks/useTogetherCoins';
import { toast } from '@/hooks/use-toast';
import togetherCoinsIcon from '@/assets/together-coins-icon.png';
import { VisualEffectsRenderer } from '@/components/VisualEffectsRenderer';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

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
  const { language } = useLanguage();
  const t = translations[language];
  const [user, setUser] = useState<User | null>(null);
  const [coupleId, setCoupleId] = useState<string>('');
  const [objectEffects, setObjectEffects] = useState<VisualEffect[]>([]);
  const [phraseEffects, setPhraseEffects] = useState<VisualEffect[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewEffect, setPreviewEffect] = useState<any>(null);
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

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      e.preventDefault();
      navigate('/shop', { replace: true });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [navigate]);

  const handlePurchase = async (effect: VisualEffect) => {
    if (!user || !coupleId) {
      toast({
        title: t.authRequired,
        description: t.authRequiredDesc,
        variant: "destructive",
      });
      return;
    }

    if (coins < effect.price) {
      toast({
        title: t.insufficientCoins,
        description: t.insufficientCoinsDesc.replace('{amount}', effect.price.toString()),
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
        title: t.effectPurchased,
        description: t.effectPurchasedDesc.replace('{name}', effect.name),
      });
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: t.purchaseFailed,
        description: t.purchaseFailedDesc,
        variant: "destructive",
      });
    }
  };

  const handlePreview = (effect: VisualEffect) => {
    console.log('Preview clicked for:', effect.name, effect);
    
    const previewData = {
      id: 'preview',
      effect_id: effect.id,
      expires_at: new Date(Date.now() + 10000).toISOString(),
      visual_effects: {
        name: effect.name,
        effect_type: effect.effect_type,
        animation: effect.animation,
        behavior: effect.behavior,
      }
    };
    
    console.log('Setting preview effect:', previewData);
    setPreviewEffect(previewData as any);
    
    toast({
      title: t.previewStarted,
      description: t.previewDesc,
    });

    setTimeout(() => {
      console.log('Clearing preview');
      setPreviewEffect(null);
    }, 10000);
  };

  const getEffectEmoji = (name: string, type: string) => {
    if (type === 'phrase') return name;
    
    const emojiMap: Record<string, string> = {
      'Falling Hearts': '💗',
      'Rose Petals': '🌸',
      'Feathers': '🪶',
      'Lantern Sparks': '✨',
      'Starbursts': '⭐',
      'Light Orbs': '💫',
      'Halo Rings': '⭕',
      'Butterflies': '🦋',
      'Moon Dust': '🌙',
      'Cupid Arrows': '💘',
      'Lockets': '🔒',
      'Infinity Symbols': '∞',
      'Silhouettes': '👥',
      'Mirrored Hearts': '💕',
    };
    return emojiMap[name] || '💖';
  };

  const getNeonColor = (behavior: string) => {
    if (behavior.includes('neon pink')) return '#ff006e';
    if (behavior.includes('neon purple')) return '#a855f7';
    if (behavior.includes('neon blue')) return '#3b82f6';
    if (behavior.includes('neon yellow')) return '#fbbf24';
    return '#ffffff';
  };

  const getAnimationClass = (behavior: string) => {
    if (behavior.includes('pulse') || behavior.includes('glow')) return 'animate-pulse';
    if (behavior.includes('shimmer')) return 'animate-shimmer';
    if (behavior.includes('flicker')) return 'animate-pulse';
    return '';
  };

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden overscroll-contain">
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
            <h1 className="text-xl font-semibold text-foreground">{t.visualEffectsTitle}</h1>
            <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border">
              <img src={togetherCoinsIcon} alt={t.visualEffectsCoins} className="w-5 h-5" />
              <span className="text-sm font-medium">{coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Renderer - Contained within shop page */}
      {previewEffect && (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          <VisualEffectsRenderer 
            coupleId={coupleId} 
            previewEffect={previewEffect}
          />
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t.loadingEffects}</div>
        ) : (
          <>
            {/* Romantic Objects */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground mb-1">{t.romanticObjects}</h2>
                <p className="text-sm text-muted-foreground">
                  {t.romanticObjectsDesc}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {objectEffects.map((effect) => (
                  <Card
                    key={effect.id}
                    className="bg-card border-border hover:bg-accent transition-all p-3 overflow-hidden"
                  >
                    <div className="flex flex-col gap-2 h-full">
                      <div className="flex items-center justify-center h-14">
                        <span 
                          className={`text-3xl ${getAnimationClass(effect.behavior)}`}
                          style={{
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          {getEffectEmoji(effect.name, effect.effect_type)}
                        </span>
                      </div>
                      <div className="text-center min-h-[2.5rem] flex flex-col justify-center px-1">
                        <p className="font-medium text-foreground text-xs mb-0.5 line-clamp-1">{effect.name}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{effect.behavior}</p>
                      </div>
                      <div className="flex gap-1.5 mt-auto">
                        <Button
                          onClick={() => handlePreview(effect)}
                          variant="outline"
                          className="flex-1 h-8 px-2 text-xs"
                          size="sm"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {t.preview}
                        </Button>
                        <Button
                          onClick={() => handlePurchase(effect)}
                          disabled={coins < effect.price}
                          className="flex-1 h-8 px-2 text-xs"
                          size="sm"
                        >
                          <img src={togetherCoinsIcon} alt="Coins" className="w-3 h-3 mr-1" />
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
                <h2 className="text-lg font-semibold text-foreground mb-1">{t.romanticPhrases}</h2>
                <p className="text-sm text-muted-foreground">
                  {t.romanticPhrasesDesc}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {phraseEffects.map((effect) => (
                  <Card
                    key={effect.id}
                    className="bg-card border-border hover:bg-accent transition-all p-3 overflow-hidden"
                  >
                    <div className="flex flex-col gap-2 h-full">
                      <div className="flex items-center justify-center h-14">
                        <span 
                          className={`text-sm font-bold ${getAnimationClass(effect.behavior)}`}
                          style={{
                            color: getNeonColor(effect.behavior),
                            textShadow: `0 0 20px ${getNeonColor(effect.behavior)}, 0 0 30px ${getNeonColor(effect.behavior)}`,
                          }}
                        >
                          {getEffectEmoji(effect.name, effect.effect_type)}
                        </span>
                      </div>
                      <div className="text-center min-h-[2.5rem] flex flex-col justify-center px-1">
                        <p className="font-medium text-foreground text-xs mb-0.5 line-clamp-1">{effect.name}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{effect.behavior}</p>
                      </div>
                      <div className="flex gap-1.5 mt-auto">
                        <Button
                          onClick={() => handlePreview(effect)}
                          variant="outline"
                          className="flex-1 h-8 px-2 text-xs"
                          size="sm"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {t.preview}
                        </Button>
                        <Button
                          onClick={() => handlePurchase(effect)}
                          disabled={coins < effect.price}
                          className="flex-1 h-8 px-2 text-xs"
                          size="sm"
                        >
                          <img src={togetherCoinsIcon} alt="Coins" className="w-3 h-3 mr-1" />
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

    </div>
  );
}
