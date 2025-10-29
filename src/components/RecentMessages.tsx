import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Coffee, Hand, Sparkles, Calendar, Gift } from "lucide-react";
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

const desireLabels: Record<string, { en: string; es: string }> = {
  kiss: { en: "wants a kiss", es: "quiere un beso" },
  hug: { en: "wants a hug", es: "quiere un abrazo" },
  qualityTime: { en: "wants quality time", es: "quiere tiempo de calidad" },
  massage: { en: "wants a massage", es: "quiere un masaje" },
  videoGames: { en: "wants to play games", es: "quiere jugar" },
  yumyum: { en: "is feeling frisky", es: "está juguetón" },
  oralSex: { en: "wants intimacy", es: "quiere intimidad" },
  coffee: { en: "wants coffee", es: "quiere café" },
  date: { en: "wants a date", es: "quiere una cita" },
  adventure: { en: "wants an adventure", es: "quiere una aventura" },
  chocolate: { en: "wants chocolate", es: "quiere chocolate" },
  cuddle: { en: "wants to cuddle", es: "quiere acurrucarse" },
  surprise: { en: "wants a surprise", es: "quiere una sorpresa" },
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
          const label = desireLabels[desire.craving_type]?.[language] || desire.craving_type;
          const isFromPartner = desire.user_id !== userId;

          return (
            <div
              key={desire.id}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-white/70"
            >
              <span className="text-sm">{emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate font-medium text-gray-900">
                  {isFromPartner
                    ? (partnerName || (language === 'en' ? 'Your partner' : 'Tu pareja'))
                    : (language === 'en' ? 'You' : 'Tú')}
                  {' '}
                  {desire.custom_message || label}
                </p>
                <p className="text-[10px] text-gray-700">
                  {formatDistanceToNow(new Date(desire.created_at), {
                    addSuffix: true,
                    locale: language === 'es' ? es : undefined,
                  })}
                </p>
              </div>
              <Heart className="w-3 h-3 text-pink-600 flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
