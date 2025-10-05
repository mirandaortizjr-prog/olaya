import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sunrise, Sunset, Sparkles, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyNote {
  id: string;
  user_id: string;
  note_type: "morning" | "evening" | "reflection";
  content: string;
  created_at: string;
}

interface DailyNotesProps {
  coupleId: string;
  userId: string;
  partnerName?: string;
}

export const DailyNotes = ({ coupleId, userId, partnerName }: DailyNotesProps) => {
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [morningNote, setMorningNote] = useState("");
  const [eveningNote, setEveningNote] = useState("");
  const [reflection, setReflection] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchTodaysNotes();

    const channel = supabase
      .channel('daily_notes_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_notes',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          fetchTodaysNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchTodaysNotes = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_notes')
      .select('*')
      .eq('couple_id', coupleId)
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }

    setNotes((data as DailyNote[]) || []);
  };

  const sendNote = async (noteType: "morning" | "evening" | "reflection", content: string) => {
    if (!content.trim()) {
      toast({
        title: t('error'),
        description: t('pleaseEnterAMessage'),
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('daily_notes')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        note_type: noteType,
        content: content.trim()
      });

    if (error) {
      console.error('Error sending note:', error);
      toast({
        title: t('error'),
        description: t('failedToSendMessage'),
        variant: "destructive"
      });
      return;
    }

    if (noteType === 'morning') setMorningNote("");
    if (noteType === 'evening') setEveningNote("");
    if (noteType === 'reflection') setReflection("");

    toast({
      title: t('success'),
      description: t('noteSent')
    });
  };

  const deleteNote = async (noteId: string) => {
    const { error } = await supabase
      .from('daily_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting note:', error);
      toast({
        title: t('error'),
        description: t('failedToDelete'),
        variant: "destructive"
      });
    }
  };

  const getNotesByType = (type: string) => notes.filter(n => n.note_type === type);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sunrise className="h-5 w-5 text-amber-500" />
            {t('morningWhisper')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('shareMorningThoughts')}
            value={morningNote}
            onChange={(e) => setMorningNote(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={() => sendNote('morning', morningNote)} className="w-full">
            {t('sendMorningWhisper')}
          </Button>
          
          <div className="space-y-2 mt-4">
            {getNotesByType('morning').map((note) => (
              <div key={note.id} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {note.user_id === userId ? t('you') : partnerName}
                    </p>
                    <p className="text-sm mt-1">{note.content}</p>
                  </div>
                  {note.user_id === userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sunset className="h-5 w-5 text-orange-500" />
            {t('eveningBlessing')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('shareEveningThoughts')}
            value={eveningNote}
            onChange={(e) => setEveningNote(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={() => sendNote('evening', eveningNote)} className="w-full">
            {t('sendEveningBlessing')}
          </Button>
          
          <div className="space-y-2 mt-4">
            {getNotesByType('evening').map((note) => (
              <div key={note.id} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {note.user_id === userId ? t('you') : partnerName}
                    </p>
                    <p className="text-sm mt-1">{note.content}</p>
                  </div>
                  {note.user_id === userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            {t('sharedReflection')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t('shareReflection')}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={() => sendNote('reflection', reflection)} className="w-full">
            {t('sendReflection')}
          </Button>
          
          <div className="space-y-2 mt-4">
            {getNotesByType('reflection').map((note) => (
              <div key={note.id} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {note.user_id === userId ? t('you') : partnerName}
                    </p>
                    <p className="text-sm mt-1">{note.content}</p>
                  </div>
                  {note.user_id === userId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};