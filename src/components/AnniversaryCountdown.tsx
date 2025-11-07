import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface AnniversaryCountdownProps {
  anniversaryDate: string | null;
  coupleId: string;
}

export const AnniversaryCountdown = ({ anniversaryDate, coupleId }: AnniversaryCountdownProps) => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [weeklyScore, setWeeklyScore] = useState(0);

  useEffect(() => {
    const fetchLoveMeter = async () => {
      try {
        const { data, error } = await supabase
          .from('love_meter' as any)
          .select('weekly_count')
          .eq('couple_id', coupleId)
          .maybeSingle();

        if (!error && data) {
          setWeeklyScore((data as any).weekly_count || 0);
        }
      } catch (err) {
        console.error('Error fetching love meter:', err);
      }
    };

    fetchLoveMeter();
  }, [coupleId]);

  useEffect(() => {
    if (!anniversaryDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const anniversary = new Date(anniversaryDate);
      
      // Get this year's anniversary
      const currentYear = now.getFullYear();
      anniversary.setFullYear(currentYear);
      
      // If this year's anniversary has passed, use next year's
      if (anniversary < now) {
        anniversary.setFullYear(currentYear + 1);
      }

      const difference = anniversary.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [anniversaryDate]);

  const getLoveLevel = (count: number) => {
    if (count >= 100) return { color: 'from-pink-500 to-rose-600' };
    if (count >= 75) return { color: 'from-red-500 to-pink-500' };
    if (count >= 50) return { color: 'from-orange-500 to-red-500' };
    if (count >= 25) return { color: 'from-yellow-500 to-orange-500' };
    return { color: 'from-blue-500 to-yellow-500' };
  };

  const weeklyLevel = getLoveLevel(weeklyScore);
  const weeklyPercentage = Math.min((weeklyScore / 100) * 100, 100);

  if (!anniversaryDate) {
    return (
      <Card className="p-3 bg-anniversary-bg border border-anniversary-border">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-anniversary-textLight" />
          <p className="text-xs text-anniversary-textDark">
            {language === 'en' ? 'Set your anniversary in settings' : 'Establece tu aniversario en configuración'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 bg-anniversary-bg border border-anniversary-border">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-anniversary-textLight fill-anniversary-textLight animate-pulse" />
          {/* Compact thermometer Love-O-Meter */}
          <div className="relative w-4 h-16 bg-muted rounded-full overflow-hidden -rotate-12">
            <div 
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${weeklyLevel.color} transition-all duration-500`}
              style={{ height: `${weeklyPercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white drop-shadow-lg rotate-12">
                {weeklyScore}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex flex-col items-center">
            <span className="font-bold text-base text-anniversary-textDark">{timeLeft.days}</span>
            <span className="text-[10px] text-anniversary-textLight">{language === 'en' ? 'd' : 'd'}</span>
          </div>
          <span className="text-anniversary-textLight">:</span>
          <div className="flex flex-col items-center">
            <span className="font-bold text-base text-anniversary-textDark">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[10px] text-anniversary-textLight">{language === 'en' ? 'h' : 'h'}</span>
          </div>
          <span className="text-anniversary-textLight">:</span>
          <div className="flex flex-col items-center">
            <span className="font-bold text-base text-anniversary-textDark">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[10px] text-anniversary-textLight">{language === 'en' ? 'm' : 'm'}</span>
          </div>
          <span className="text-anniversary-textLight">:</span>
          <div className="flex flex-col items-center">
            <span className="font-bold text-base text-anniversary-textDark">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[10px] text-anniversary-textLight">{language === 'en' ? 's' : 's'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
