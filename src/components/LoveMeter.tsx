import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Heart, TrendingUp, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoveMeterData {
  interaction_count: number;
  weekly_count: number;
  last_interaction_at: string | null;
}

interface LoveMeterProps {
  coupleId: string;
}

export const LoveMeter = ({ coupleId }: LoveMeterProps) => {
  const [meterData, setMeterData] = useState<LoveMeterData>({
    interaction_count: 0,
    weekly_count: 0,
    last_interaction_at: null,
  });
  const { language } = useLanguage();

  useEffect(() => {
    fetchLoveMeter();
  }, [coupleId]);

  const fetchLoveMeter = async () => {
    try {
      const { data, error } = await supabase
        .from('love_meter' as any)
        .select('interaction_count, weekly_count, last_interaction_at')
        .eq('couple_id', coupleId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching love meter:', error);
        return;
      }

      if (data) {
        setMeterData(data as unknown as LoveMeterData);
      }
    } catch (err) {
      console.error('Error in fetchLoveMeter:', err);
    }
  };

  const getLoveLevel = (count: number) => {
    if (count >= 100) return { level: language === 'en' ? 'Soulmates' : 'Almas Gemelas', color: 'from-pink-500 to-rose-600', emoji: '💕' };
    if (count >= 75) return { level: language === 'en' ? 'Deeply Connected' : 'Profundamente Conectados', color: 'from-red-500 to-pink-500', emoji: '❤️' };
    if (count >= 50) return { level: language === 'en' ? 'Growing Strong' : 'Creciendo Fuerte', color: 'from-orange-500 to-red-500', emoji: '🧡' };
    if (count >= 25) return { level: language === 'en' ? 'Warming Up' : 'Calentando', color: 'from-yellow-500 to-orange-500', emoji: '💛' };
    return { level: language === 'en' ? 'Getting Started' : 'Comenzando', color: 'from-blue-500 to-yellow-500', emoji: '💙' };
  };

  const weeklyLevel = getLoveLevel(meterData.weekly_count);
  const weeklyPercentage = Math.min((meterData.weekly_count / 100) * 100, 100);

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-romantic flex items-center justify-center animate-pulse">
          <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
        </div>
        <div>
          <h3 className="text-base font-semibold">
            {language === 'en' ? 'Love-O-Meter' : 'Medidor de Amor'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === 'en' ? 'Track your connection' : 'Rastrea tu conexión'}
          </p>
        </div>
      </div>

      {/* Weekly Score */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium">
                {language === 'en' ? 'This Week' : 'Esta Semana'}
              </span>
            </div>
            <span className="text-lg font-bold">{weeklyLevel.emoji}</span>
          </div>
          
          <div className="relative h-6 bg-muted rounded-full overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${weeklyLevel.color} transition-all duration-500 flex items-center justify-end pr-2`}
              style={{ width: `${weeklyPercentage}%` }}
            >
              {meterData.weekly_count > 0 && (
                <span className="text-xs font-bold text-white drop-shadow-lg">
                  {meterData.weekly_count}
                </span>
              )}
            </div>
          </div>
          
          <p className="text-xs text-center mt-1.5 font-semibold text-primary">
            {weeklyLevel.level}
          </p>
        </div>

        {/* Total Interactions */}
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-accent" />
              <span className="text-xs text-muted-foreground">
                {language === 'en' ? 'All Time' : 'Total'}
              </span>
            </div>
            <span className="text-lg font-bold bg-gradient-romantic bg-clip-text text-transparent">
              {meterData.interaction_count}
            </span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-3 p-2 bg-card/50 rounded-lg border border-primary/10">
          <p className="text-[10px] text-muted-foreground text-center">
            {language === 'en' 
              ? '💡 Every interaction counts! Send messages, share notes, and create memories together.'
              : '💡 ¡Cada interacción cuenta! Envía mensajes, comparte notas y crea recuerdos juntos.'}
          </p>
        </div>
      </div>
    </Card>
  );
};
