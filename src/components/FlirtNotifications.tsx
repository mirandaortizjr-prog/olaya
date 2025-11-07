import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Heart, Sparkles, Wind, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Flirt {
  id: string;
  flirt_type: string;
  sender_id: string;
  created_at: string;
}

interface FlirtNotificationsProps {
  coupleId: string;
  userId: string;
  partnerName: string;
  lastViewedTimestamp?: Date;
}

const FLIRT_ICONS: Record<string, { icon: any; emoji: string; label: string }> = {
  wink: { icon: Eye, emoji: "😘", label: "Winked at you" },
  kiss: { icon: Heart, emoji: "💋", label: "Sent you a kiss" },
  bite: { icon: Sparkles, emoji: "🦷", label: "Playfully bit you" },
  lick: { icon: Wind, emoji: "👅", label: "Licked you" },
  heart: { icon: Heart, emoji: "❤️", label: "Sent you hearts" },
  fire: { icon: Flame, emoji: "🔥", label: "Is feeling fire" },
};

export const FlirtNotifications = ({ coupleId, userId, partnerName, lastViewedTimestamp }: FlirtNotificationsProps) => {
  const [recentFlirts, setRecentFlirts] = useState<Flirt[]>([]);
  const { toast } = useToast();

  const isNewFlirt = (createdAt: string) => {
    if (!lastViewedTimestamp) return false;
    return new Date(createdAt) > lastViewedTimestamp;
  };

  useEffect(() => {
    fetchRecentFlirts();

    // Set up real-time subscription for new flirts
    const channel = supabase
      .channel('flirts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'flirts',
          filter: `couple_id=eq.${coupleId}`
        },
        (payload) => {
          const newFlirt = payload.new as Flirt;
          
          // Only show notification if it's from partner
          if (newFlirt.sender_id !== userId) {
            const flirtInfo = FLIRT_ICONS[newFlirt.flirt_type];
            if (flirtInfo) {
              toast({
                title: `${flirtInfo.emoji} ${partnerName} ${flirtInfo.label}!`,
                description: "Check your flirt notifications",
              });
            }
            
            setRecentFlirts(prev => [newFlirt, ...prev].slice(0, 5));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId, userId, partnerName, toast]);

  const fetchRecentFlirts = async () => {
    const { data, error } = await supabase
      .from('flirts')
      .select('*')
      .eq('couple_id', coupleId)
      .neq('sender_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data && !error) {
      setRecentFlirts(data);
    }
  };

  return (
    <ScrollArea className="h-24">
      <div className="space-y-1.5 pr-2">
        {recentFlirts.length === 0 ? (
          <p className="text-xs text-amber-700 dark:text-amber-300 text-center py-4">
            No recent flirts
          </p>
        ) : (
          recentFlirts.map((flirt) => {
            const flirtInfo = FLIRT_ICONS[flirt.flirt_type];
            if (!flirtInfo) return null;

            const FlirtIcon = flirtInfo.icon;
            const isNew = isNewFlirt(flirt.created_at);
            
            return (
              <div
                key={flirt.id}
                className={`flex items-center gap-2 p-1.5 rounded-lg relative ${
                  isNew ? 'bg-green-50 dark:bg-green-950/30 ring-2 ring-green-500' : 'bg-white/70 dark:bg-white/10'
                }`}
              >
                {isNew && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
                <span className="text-lg">{flirtInfo.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate text-amber-900 dark:text-amber-100">
                    {flirtInfo.label}
                    {isNew && <span className="ml-1 text-green-600">• New!</span>}
                  </p>
                  <p className="text-[10px] text-amber-800 dark:text-amber-200">
                    {formatDistanceToNow(new Date(flirt.created_at), { addSuffix: true })}
                  </p>
                </div>
                <FlirtIcon className="w-3 h-3 text-red-600 flex-shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};
