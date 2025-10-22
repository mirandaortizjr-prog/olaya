import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Heart, Flame, Sparkles, Mail, Brain } from "lucide-react";

interface QuickActionsProps {
  coupleId: string;
  userId: string;
}

const quickMessageTypes = [
  { type: 'wink', icon: Eye, label: { en: 'Wink', es: 'Guiño' }, color: 'from-purple-500/20 to-pink-500/20' },
  { type: 'kiss', icon: Heart, label: { en: 'Kiss', es: 'Beso' }, color: 'from-red-500/20 to-pink-500/20' },
  { type: 'love', icon: Mail, label: { en: 'I Love You', es: 'Te Amo' }, color: 'from-pink-500/20 to-rose-500/20' },
  { type: 'want', icon: Flame, label: { en: 'I Want You', es: 'Te Deseo' }, color: 'from-orange-500/20 to-red-500/20' },
  { type: 'hot', icon: Sparkles, label: { en: "You're Hot", es: 'Estás Ardiente' }, color: 'from-amber-500/20 to-orange-500/20' },
  { type: 'thinking', icon: Brain, label: { en: "Thinking of You", es: 'Pensando en Ti' }, color: 'from-blue-500/20 to-purple-500/20' },
] as const;

export const QuickActions = ({ coupleId, userId }: QuickActionsProps) => {
  const [sending, setSending] = useState<string | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const sendQuickMessage = async (messageType: string) => {
    setSending(messageType);
    try {
      const { error } = await supabase
        .from('quick_messages')
        .insert({
          couple_id: coupleId,
          sender_id: userId,
          message_type: messageType,
        });

      if (error) throw error;

      // Get partner's user_id to send push notification
      const { data: members } = await supabase
        .from('couple_members')
        .select('user_id')
        .eq('couple_id', coupleId)
        .neq('user_id', userId)
        .single();

      if (members) {
        // Send push notification to partner
        const messageLabels: Record<string, { en: string; es: string }> = {
          wink: { en: 'Wink wink 😉✨', es: 'Guiño guiño 😉✨' },
          kiss: { en: 'Muahh 💋💋', es: 'Muahh 💋💋' },
          love: { en: 'I love you baby 💕😘', es: 'Te amo mi amor 💕😘' },
          want: { en: 'I want you now 🔥😈', es: 'Te deseo ahora 🔥😈' },
          hot: { en: "You're so hot 🌟🔥", es: 'Estás tan ardiente 🌟🔥' },
          thinking: { en: "Can't stop thinking of you 💭💕", es: 'No puedo dejar de pensar en ti 💭💕' },
        };

        await supabase.functions.invoke('send-push-notification', {
          body: {
            userId: members.user_id,
            title: 'Unio',
            body: messageLabels[messageType]?.[language] || messageLabels.wink[language],
          },
        });
      }

      toast({
        title: language === 'en' ? 'Sent!' : '¡Enviado!',
        description: language === 'en' 
          ? 'Your message was sent to your partner.' 
          : 'Tu mensaje fue enviado a tu pareja.',
      });
    } catch (error: any) {
      toast({
        title: language === 'en' ? 'Error' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSending(null);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <h3 className="text-lg font-semibold mb-4">
        {language === 'en' ? 'Quick Messages' : 'Mensajes Rápidos'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickMessageTypes.map(({ type, icon: Icon, label, color }) => (
          <Button
            key={type}
            variant="outline"
            className={`flex flex-col items-center justify-center h-24 gap-2 bg-gradient-to-br ${color} hover:scale-105 transition-transform`}
            onClick={() => sendQuickMessage(type)}
            disabled={sending === type}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label[language]}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};
