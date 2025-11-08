import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Heart, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface JournalEntry {
  id: string;
  encounter_date: string;
  encounter_time: string | null;
  location: string | null;
  description: string | null;
  user_experience: string;
  partner_experience: string | null;
  created_by: string;
  created_at: string;
}

interface IntimateJournalListProps {
  coupleId: string;
  refreshTrigger: number;
}

export const IntimateJournalList = ({ coupleId, refreshTrigger }: IntimateJournalListProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [coupleId, refreshTrigger]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('intimate_journal')
      .select('*')
      .eq('couple_id', coupleId)
      .order('encounter_date', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('intimate_journal')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Entry Deleted',
      description: 'Journal entry has been removed',
    });
    
    fetchEntries();
  };

  if (entries.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No journal entries yet. Create your first memory above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Your Memories</h2>
      {entries.map((entry) => (
        <Card key={entry.id} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(entry.encounter_date), 'PPP')}
                </Badge>
                {entry.encounter_time && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {entry.encounter_time}
                  </Badge>
                )}
                {entry.location && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {entry.location}
                  </Badge>
                )}
              </div>
              {userId === entry.created_by && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this journal entry? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(entry.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="space-y-4">
              {entry.description && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-foreground whitespace-pre-wrap">{entry.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-sm text-primary mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  What I Loved
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{entry.user_experience}</p>
              </div>

              {entry.partner_experience && (
                <div>
                  <h3 className="font-semibold text-sm text-primary mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    What My Partner Loved
                  </h3>
                  <p className="text-foreground whitespace-pre-wrap">{entry.partner_experience}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Added {format(new Date(entry.created_at), 'PPP')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
