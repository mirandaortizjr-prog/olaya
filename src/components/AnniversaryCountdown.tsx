import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnniversaryCountdownProps {
  anniversaryDate: string | null;
}

export const AnniversaryCountdown = ({ anniversaryDate }: AnniversaryCountdownProps) => {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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

  if (!anniversaryDate) {
    return (
      <Card className="p-3 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <p className="text-xs text-muted-foreground">
            {language === 'en' ? 'Set your anniversary in settings' : 'Establece tu aniversario en configuración'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-xs font-semibold text-foreground">
            {language === 'en' ? 'Anniversary' : 'Aniversario'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex flex-col items-center">
            <span className="font-bold text-base text-rose-500">{timeLeft.days}</span>
            <span className="text-[10px] text-muted-foreground">{language === 'en' ? 'd' : 'd'}</span>
          </div>
          <span className="text-muted-foreground">:</span>
          <div className="flex flex-col items-center">
            <span className="font-bold text-base text-rose-500">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[10px] text-muted-foreground">{language === 'en' ? 'h' : 'h'}</span>
          </div>
          <span className="text-muted-foreground">:</span>
          <div className="flex flex-col items-center">
            <span className="font-bold text-base text-rose-500">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[10px] text-muted-foreground">{language === 'en' ? 'm' : 'm'}</span>
          </div>
          <span className="text-muted-foreground">:</span>
          <div className="flex flex-col items-center">
            <span className="font-bold text-base text-rose-500">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[10px] text-muted-foreground">{language === 'en' ? 's' : 's'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
