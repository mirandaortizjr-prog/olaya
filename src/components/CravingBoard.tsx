import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, Coffee, PartyPopper, Timer, Users, Hand, Sparkles, Calendar, Gift, Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Craving {
  id: string;
  user_id: string;
  craving_type: string;
  custom_message: string | null;
  fulfilled: boolean;
  created_at: string;
  fulfilled_at: string | null;
}

interface CravingBoardProps {
  coupleId: string;
  userId: string;
  partnerName?: string;
}

const cravingTypes = [
  { type: 'hug', icon: Hand, color: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-600', emoji: '🤗' },
  { type: 'kiss', icon: Heart, color: 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-600', emoji: '💋' },
  { type: 'chocolate', icon: Gift, color: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-600', emoji: '🍫' },
  { type: 'coffee', icon: Coffee, color: 'bg-brown-500/20 hover:bg-brown-500/30 text-orange-800', emoji: '☕' },
  { type: 'qualityTime', icon: Users, color: 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-600', emoji: '👥' },
  { type: 'cuddle', icon: Heart, color: 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-600', emoji: '🥰' },
  { type: 'massage', icon: Sparkles, color: 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-600', emoji: '💆' },
  { type: 'date', icon: Calendar, color: 'bg-red-500/20 hover:bg-red-500/30 text-red-600', emoji: '💑' },
  { type: 'yumyum', icon: Heart, color: 'bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-600', emoji: '🍑' },
  { type: 'oralSex', icon: Heart, color: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-700', emoji: '👅' },
  { type: 'surprise', icon: PartyPopper, color: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600', emoji: '🎉' },
  { type: 'custom', icon: Sparkles, color: 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-600', emoji: '✨' },
];

export const CravingBoard = ({ coupleId, userId, partnerName }: CravingBoardProps) => {
  const [cravings, setCravings] = useState<Craving[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchCravings();

    const channel = supabase
      .channel('craving_board_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'craving_board',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          fetchCravings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchCravings = async () => {
    const { data, error } = await supabase
      .from('craving_board')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cravings:', error);
      return;
    }

    setCravings((data as Craving[]) || []);
  };

  const addCraving = async (type: string) => {
    if (type === 'custom' && !customMessage.trim()) {
      toast({
        title: t('error'),
        description: t('pleaseEnterCustomMessage'),
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('craving_board')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        craving_type: type,
        custom_message: type === 'custom' ? customMessage.trim() : null
      });

    if (error) {
      console.error('Error adding craving:', error);
      toast({
        title: t('error'),
        description: t('failedToAddCraving'),
        variant: "destructive"
      });
      return;
    }

    setSelectedType(null);
    setCustomMessage("");
    toast({
      title: t('success'),
      description: t('cravingAdded')
    });
  };

  const fulfillCraving = async (cravingId: string) => {
    const { error } = await supabase
      .from('craving_board')
      .update({
        fulfilled: true,
        fulfilled_at: new Date().toISOString()
      })
      .eq('id', cravingId);

    if (error) {
      console.error('Error fulfilling craving:', error);
      toast({
        title: t('error'),
        description: t('failedToFulfill'),
        variant: "destructive"
      });
      return;
    }

    toast({
      title: t('success'),
      description: t('cravingFulfilled')
    });
  };

  const deleteCraving = async (cravingId: string) => {
    const { error } = await supabase
      .from('craving_board')
      .delete()
      .eq('id', cravingId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting craving:', error);
      toast({
        title: t('error'),
        description: t('failedToDelete'),
        variant: "destructive"
      });
    }
  };

  const getCravingConfig = (type: string) => {
    return cravingTypes.find(c => c.type === type) || cravingTypes[0];
  };

  const activeCravings = cravings.filter(c => !c.fulfilled);
  const fulfilledCravings = cravings.filter(c => c.fulfilled).slice(0, 3);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className="h-4 w-4 text-pink-500" />
          {t('cravingBoard')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        {/* Quick Craving Buttons */}
        <div>
          <p className="text-xs font-medium mb-2">{t('whatDoYouCrave')}</p>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-1.5">
            {cravingTypes.map((craving) => {
              return (
                <Button
                  key={craving.type}
                  variant="outline"
                  size="sm"
                  className={cn("h-auto flex-col gap-1 py-2 px-1", craving.color)}
                  onClick={() => {
                    if (craving.type === 'custom') {
                      setSelectedType(craving.type);
                    } else {
                      addCraving(craving.type);
                    }
                  }}
                >
                  <span className="text-lg">{craving.emoji}</span>
                  <span className="text-[10px] leading-tight">{t(`craving_${craving.type}` as any)}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Custom Message Input */}
        {selectedType === 'custom' && (
          <div className="space-y-2 p-3 border rounded-lg animate-fade-in">
            <Input
              placeholder={t('enterCustomCraving')}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="h-8 text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={() => addCraving('custom')} size="sm" className="flex-1 h-8 text-xs">
                {t('addCraving')}
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setSelectedType(null); setCustomMessage(""); }}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}

        {/* Active Cravings - Scrollable with Bold Scrollbar */}
        <div className="space-y-2">
          <p className="text-xs font-medium">{t('activeCravings')}</p>
          {activeCravings.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-xs">
              {t('noCravingsYet')}
            </div>
          ) : (
            <div 
              className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2 scrollbar-bold"
              style={{
                scrollbarWidth: 'auto',
                scrollbarColor: 'hsl(var(--primary)) transparent'
              }}
            >
              {activeCravings.map((craving) => {
                const config = getCravingConfig(craving.craving_type);
                const isMine = craving.user_id === userId;
                return (
                  <div
                    key={craving.id}
                    className={cn(
                      "p-2.5 rounded-lg border",
                      config.color,
                      "transition-all"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-lg">{config.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {isMine ? t('you') : partnerName} {t('wants')}:
                          </p>
                          <p className="text-xs truncate">
                            {craving.custom_message || t(`craving_${craving.craving_type}` as any)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {!isMine && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 w-7 p-0"
                            onClick={() => fulfillCraving(craving.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        {isMine && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => deleteCraving(craving.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recently Fulfilled */}
        {fulfilledCravings.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground">{t('recentlyFulfilled')}</p>
            <div className="space-y-1">
              {fulfilledCravings.map((craving) => {
                const config = getCravingConfig(craving.craving_type);
                return (
                  <div
                    key={craving.id}
                    className="p-1.5 rounded bg-muted/50 flex items-center gap-1.5 text-[10px] text-muted-foreground"
                  >
                    <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{config.emoji}</span>
                    <span className="truncate">{craving.custom_message || t(`craving_${craving.craving_type}` as any)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};