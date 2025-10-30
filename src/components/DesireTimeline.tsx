import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, CheckCircle, XCircle, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DesireTimelineProps {
  coupleId: string;
  userId: string;
}

interface TimelineEntry {
  id: string;
  title: string;
  category: string;
  fulfilled: boolean;
  fulfilled_at: string | null;
  created_at: string;
  user_id: string;
}

const categoryConfig = {
  fantasy: { emoji: '✨' },
  roleplay: { emoji: '🎭' },
  fetish: { emoji: '🔥' },
  toy: { emoji: '🎁' },
  position: { emoji: '💕' },
  location: { emoji: '📍' },
  intimate: { emoji: '❤️' },
  romantic: { emoji: '🌹' },
  adventure: { emoji: '🌟' },
  experience: { emoji: '💫' },
};

export const DesireTimeline = ({ coupleId, userId }: DesireTimelineProps) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);

  useEffect(() => {
    fetchTimeline();

    const channel = supabase
      .channel('desire_timeline_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'desire_vault',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          fetchTimeline();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchTimeline = async () => {
    const { data, error } = await supabase
      .from('desire_vault')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('fulfilled', true)
      .not('fulfilled_at', 'is', null)
      .order('fulfilled_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Desire Journey Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No fulfilled desires yet. Start your journey!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => {
                const config = categoryConfig[entry.category as keyof typeof categoryConfig];
                return (
                  <div key={entry.id} className="relative">
                    {index !== entries.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
                    )}
                    <Card className="relative overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{config?.emoji}</span>
                              <h4 className="font-medium">{entry.title}</h4>
                              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                                Fulfilled
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {entry.fulfilled_at && format(new Date(entry.fulfilled_at), 'MMMM d, yyyy • h:mm a')}
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {entry.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
