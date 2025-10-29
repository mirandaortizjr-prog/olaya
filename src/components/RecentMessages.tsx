import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { showQuickMessageNotification } from "@/utils/notifications";
import { Eye, Heart, Flame, Sparkles, Mail, Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface RecentMessagesProps {
  coupleId: string;
  userId: string;
  partnerName?: string;
}

const messageIcons = {
  wink: Eye,
  kiss: Heart,
  love: Mail,
  want: Flame,
  hot: Sparkles,
  thinking: Brain,
};

const messageLabels = {
  wink: { en: 'sent you a wink', es: 'te envió un guiño' },
  kiss: { en: 'sent you a kiss', es: 'te envió un beso' },
  love: { en: 'said I love you', es: 'dijo te amo' },
  want: { en: 'said I want you', es: 'dijo te deseo' },
  hot: { en: "said you're hot", es: 'dijo estás ardiente' },
  thinking: { en: 'is thinking of you', es: 'está pensando en ti' },
};

export const RecentMessages = ({ coupleId, userId, partnerName }: RecentMessagesProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('quick-messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quick_messages',
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          setMessages((current) => [newMessage, ...current].slice(0, 5));
          
          // Show notification if message is from partner
          if (newMessage.sender_id !== userId) {
            showQuickMessageNotification(
              newMessage.message_type,
              partnerName,
              language
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('quick_messages')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setMessages(data);
    }
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <Card className="p-3 bg-[#F5E6D3] border-gray-300 max-h-32">
      <h3 className="text-xs font-semibold mb-2 text-gray-800 flex items-center gap-2">
        <Mail className="w-3 h-3 text-pink-500" />
        {language === 'en' ? 'Recent Messages' : 'Mensajes Recientes'}
      </h3>
      <div className="space-y-1 overflow-y-auto max-h-20 pr-1">
        {messages.map((message) => {
          const Icon = messageIcons[message.message_type as keyof typeof messageIcons];
          const label = messageLabels[message.message_type as keyof typeof messageLabels];
          const isFromPartner = message.sender_id !== userId;

          return (
            <div
              key={message.id}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-white/60"
            >
              <span className="text-sm">{Icon ? '💬' : '📱'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate">
                  {isFromPartner
                    ? language === 'en' ? 'Your partner' : 'Tu pareja'
                    : language === 'en' ? 'You' : 'Tú'}
                  {' '}
                  {label[language]}
                </p>
                <p className="text-[10px] text-gray-600">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: language === 'es' ? es : undefined,
                  })}
                </p>
              </div>
              {Icon && <Icon className="w-3 h-3 text-pink-500 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
