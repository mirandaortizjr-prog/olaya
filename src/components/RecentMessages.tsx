import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface RecentMessagesProps {
  coupleId: string;
  userId: string;
  partnerName?: string;
}

interface Craving {
  id: string;
  user_id: string;
  craving_type: string;
  custom_message: string | null;
  fulfilled: boolean;
  created_at: string;
}

const desireEmojis: Record<string, string> = {
  kiss: "💋",
  hug: "🤗",
  qualityTime: "⏰",
  massage: "💆",
  videoGames: "🎮",
  yumyum: "🔥",
  oralSex: "✨",
  coffee: "☕",
  date: "🌟",
  adventure: "🗺️",
  chocolate: "🍫",
  cuddle: "🥰",
  surprise: "🎉",
  custom: "💝",
};

const desireLabels: Record<string, { en: { thirdPerson: string; firstPerson: string }; es: { thirdPerson: string; firstPerson: string } }> = {
  kiss: { en: { thirdPerson: "wants a kiss", firstPerson: "want a kiss" }, es: { thirdPerson: "quiere un beso", firstPerson: "quiero un beso" } },
  hug: { en: { thirdPerson: "wants a hug", firstPerson: "want a hug" }, es: { thirdPerson: "quiere un abrazo", firstPerson: "quiero un abrazo" } },
  qualityTime: { en: { thirdPerson: "wants quality time", firstPerson: "want quality time" }, es: { thirdPerson: "quiere tiempo de calidad", firstPerson: "quiero tiempo de calidad" } },
  massage: { en: { thirdPerson: "wants a massage", firstPerson: "want a massage" }, es: { thirdPerson: "quiere un masaje", firstPerson: "quiero un masaje" } },
  videoGames: { en: { thirdPerson: "wants to play games", firstPerson: "want to play games" }, es: { thirdPerson: "quiere jugar", firstPerson: "quiero jugar" } },
  yumyum: { en: { thirdPerson: "is feeling frisky", firstPerson: "am feeling frisky" }, es: { thirdPerson: "está juguetón", firstPerson: "estoy juguetón" } },
  oralSex: { en: { thirdPerson: "wants intimacy", firstPerson: "want intimacy" }, es: { thirdPerson: "quiere intimidad", firstPerson: "quiero intimidad" } },
  coffee: { en: { thirdPerson: "wants coffee", firstPerson: "want coffee" }, es: { thirdPerson: "quiere café", firstPerson: "quiero café" } },
  date: { en: { thirdPerson: "wants a date", firstPerson: "want a date" }, es: { thirdPerson: "quiere una cita", firstPerson: "quiero una cita" } },
  adventure: { en: { thirdPerson: "wants an adventure", firstPerson: "want an adventure" }, es: { thirdPerson: "quiere una aventura", firstPerson: "quiero una aventura" } },
  chocolate: { en: { thirdPerson: "wants chocolate", firstPerson: "want chocolate" }, es: { thirdPerson: "quiere chocolate", firstPerson: "quiero chocolate" } },
  cuddle: { en: { thirdPerson: "wants to cuddle", firstPerson: "want to cuddle" }, es: { thirdPerson: "quiere acurrucarse", firstPerson: "quiero acurrucarse" } },
  surprise: { en: { thirdPerson: "wants a surprise", firstPerson: "want a surprise" }, es: { thirdPerson: "quiere una sorpresa", firstPerson: "quiero una sorpresa" } },
};

export const RecentMessages = ({ coupleId, userId, partnerName }: RecentMessagesProps) => {
  const [desires, setDesires] = useState<Craving[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    fetchDesires();

    const channel = supabase
      .channel('recent-desires-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'craving_board',
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          const newDesire = payload.new as Craving;
          setDesires((current) => [newDesire, ...current].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchDesires = async () => {
    const { data, error } = await supabase
      .from('craving_board')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setDesires(data as Craving[]);
    }
  };

  const fulfillDesire = async (desireId: string) => {
    const { error } = await supabase
      .from('craving_board')
      .update({
        fulfilled: true,
        fulfilled_at: new Date().toISOString()
      })
      .eq('id', desireId);

    if (error) {
      console.error('Error fulfilling desire:', error);
    }
  };

  if (desires.length === 0) {
    return null;
  }

  return (
    <Card className="p-3 bg-[#F5E6D3] border-gray-300 max-h-32">
      <h3 className="text-xs font-semibold mb-2 text-gray-900 flex items-center gap-2">
        <Heart className="w-3 h-3 text-pink-600" />
        {language === 'en' ? 'Recent Desires' : 'Deseos Recientes'}
      </h3>
      <div className="space-y-1 overflow-y-auto max-h-20 pr-1">
        {desires.map((desire) => {
          const emoji = desireEmojis[desire.craving_type] || desireEmojis.custom;
          const isFromPartner = desire.user_id !== userId;
          const labelObj = desireLabels[desire.craving_type]?.[language];
          const label = isFromPartner 
            ? labelObj?.thirdPerson 
            : labelObj?.firstPerson;

          return (
            <div
              key={desire.id}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-white/70"
            >
              <span className="text-sm">{emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate font-medium text-gray-900">
                  {isFromPartner
                    ? partnerName || (language === 'en' ? 'Your partner' : 'Tu pareja')
                    : (language === 'en' ? 'You' : 'Yo')}
                  {' '}
                  {desire.custom_message || label || desire.craving_type}
                </p>
                <p className="text-[10px] text-gray-700">
                  {formatDistanceToNow(new Date(desire.created_at), {
                    addSuffix: true,
                    locale: language === 'es' ? es : undefined,
                  })}
                </p>
              </div>
              {isFromPartner && !desire.fulfilled && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-green-100"
                  onClick={() => fulfillDesire(desire.id)}
                >
                  <Check className="h-3.5 w-3.5 text-green-600" />
                </Button>
              )}
              {desire.fulfilled && (
                <Check className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              )}
              {!isFromPartner && !desire.fulfilled && (
                <Heart className="w-3 h-3 text-pink-600 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
