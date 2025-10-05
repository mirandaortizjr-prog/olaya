import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, Sparkles, Star, Gift, Flame, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LoveNote {
  id: string;
  sender_id: string;
  note_type: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface LoveNotesProps {
  coupleId: string;
  userId: string;
  partnerName?: string;
}

const noteTypes = [
  { 
    type: 'flirtation', 
    icon: Eye, 
    color: 'bg-pink-500/20 hover:bg-pink-500/30 text-pink-600 dark:text-pink-400',
    emoji: '😘'
  },
  { 
    type: 'devotion', 
    icon: Heart, 
    color: 'bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400',
    emoji: '❤️'
  },
  { 
    type: 'affirmation', 
    icon: Star, 
    color: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600 dark:text-yellow-400',
    emoji: '⭐'
  },
  { 
    type: 'appreciation', 
    icon: Gift, 
    color: 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 dark:text-purple-400',
    emoji: '🎁'
  },
  { 
    type: 'adoration', 
    icon: Sparkles, 
    color: 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-600 dark:text-rose-400',
    emoji: '✨'
  },
  { 
    type: 'desire', 
    icon: Flame, 
    color: 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-600 dark:text-orange-400',
    emoji: '🔥'
  },
];

export const LoveNotes = ({ coupleId, userId, partnerName }: LoveNotesProps) => {
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel('love_notes_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'love_notes',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('love_notes')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching love notes:', error);
      return;
    }

    setNotes((data as LoveNote[]) || []);
  };

  const sendNote = async () => {
    if (!selectedType || !content.trim()) {
      toast({
        title: t('error'),
        description: t('pleaseEnterAMessage'),
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('love_notes')
      .insert({
        couple_id: coupleId,
        sender_id: userId,
        note_type: selectedType,
        content: content.trim()
      });

    if (error) {
      console.error('Error sending love note:', error);
      toast({
        title: t('error'),
        description: t('failedToSendMessage'),
        variant: "destructive"
      });
      return;
    }

    setSelectedType(null);
    setContent("");
    toast({
      title: t('success'),
      description: t('loveNoteSent')
    });
  };

  const markAsRead = async (noteId: string, senderId: string) => {
    if (senderId === userId) return; // Don't mark own notes as read

    const { error } = await supabase
      .from('love_notes')
      .update({ read_at: new Date().toISOString() })
      .eq('id', noteId)
      .is('read_at', null);

    if (error) {
      console.error('Error marking note as read:', error);
    }
  };

  const getNoteConfig = (type: string) => {
    return noteTypes.find(nt => nt.type === type) || noteTypes[0];
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          {t('loveNotes')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Note Type Selection */}
        <div>
          <p className="text-sm font-medium mb-3">{t('chooseNoteType')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {noteTypes.map((noteType) => {
              const Icon = noteType.icon;
              return (
                <Button
                  key={noteType.type}
                  variant={selectedType === noteType.type ? "default" : "outline"}
                  className={`h-auto flex-col gap-2 py-3 ${noteType.color}`}
                  onClick={() => setSelectedType(noteType.type)}
                >
                  <span className="text-2xl">{noteType.emoji}</span>
                  <span className="text-xs">{t(`noteType_${noteType.type}` as any)}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Note Composer */}
        {selectedType && (
          <div className="space-y-3 animate-fade-in">
            <Textarea
              placeholder={t('writeYourLoveNote')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex gap-2">
              <Button onClick={sendNote} className="flex-1">
                {t('sendLoveNote')}
              </Button>
              <Button variant="outline" onClick={() => { setSelectedType(null); setContent(""); }}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}

        {/* Notes Display */}
        <div>
          <p className="text-sm font-medium mb-3">{t('recentLoveNotes')}</p>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t('noLoveNotesYet')}
                </p>
              ) : (
                notes.map((note) => {
                  const config = getNoteConfig(note.note_type);
                  const isFromUser = note.sender_id === userId;
                  
                  return (
                    <div
                      key={note.id}
                      className={`p-4 rounded-lg border ${config.color} ${
                        !note.read_at && !isFromUser ? 'ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => markAsRead(note.id, note.sender_id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{config.emoji}</span>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium">
                              {isFromUser ? t('you') : partnerName} • {t(`noteType_${note.note_type}` as any)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTimeSince(note.created_at)}
                            </p>
                          </div>
                          <p className="text-sm">{note.content}</p>
                          {!note.read_at && !isFromUser && (
                            <p className="text-xs text-primary font-medium">{t('new')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};