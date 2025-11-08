import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Trash2, User } from 'lucide-react';
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
  title: string;
  content: string;
  mood: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface SharedJournalListProps {
  coupleId: string;
  refreshTrigger: number;
}

export const SharedJournalList = ({ coupleId, refreshTrigger }: SharedJournalListProps) => {
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
      .from('shared_journal')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('shared_journal')
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
          <p className="text-muted-foreground">No journal entries yet. Create your first entry above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Your Shared Journal</h2>
      {entries.map((entry) => (
        <Card key={entry.id} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(entry.created_at), 'PPP')}
                  </Badge>
                  {entry.mood && (
                    <Badge variant="secondary">
                      {entry.mood}
                    </Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {userId === entry.author_id ? 'You' : 'Partner'}
                  </Badge>
                </div>
              </div>
              {userId === entry.author_id && (
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

            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
