import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface SharedJournalProps {
  coupleId: string;
  userId: string;
}

export const SharedJournal = ({ coupleId, userId }: SharedJournalProps) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, [coupleId]);

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

  const addEntry = async () => {
    if (!title.trim() || !content.trim()) return;

    const { error } = await supabase.from('shared_journal').insert({
      couple_id: coupleId,
      author_id: userId,
      title,
      content,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add journal entry',
        variant: 'destructive',
      });
      return;
    }

    setTitle('');
    setContent('');
    setIsOpen(false);
    fetchEntries();
    toast({
      title: 'Entry Added',
      description: 'Your journal entry has been saved',
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Shared Journal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Entry title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
              <Button onClick={addEntry} className="w-full">Save Entry</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">{entry.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{entry.content}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.created_at), 'PPP')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
