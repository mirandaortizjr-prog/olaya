import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface RelationshipTimelineProps {
  coupleId: string;
  userId: string;
}

export const RelationshipTimeline = ({ coupleId, userId }: RelationshipTimelineProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('milestone');
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [coupleId]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('relationship_timeline')
      .select('*')
      .eq('couple_id', coupleId)
      .order('event_date', { ascending: false });

    if (!error && data) {
      setEvents(data);
    }
  };

  const addEvent = async () => {
    if (!title.trim() || !eventDate) return;

    const { error } = await supabase.from('relationship_timeline').insert({
      couple_id: coupleId,
      created_by: userId,
      title,
      description,
      event_date: eventDate,
      event_type: eventType,
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add timeline event',
        variant: 'destructive',
      });
      return;
    }

    setTitle('');
    setDescription('');
    setEventDate('');
    setIsOpen(false);
    fetchEvents();
    toast({
      title: 'Event Added',
      description: 'Timeline event has been saved',
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Relationship Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timeline Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Event title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="memory">Special Memory</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addEvent} className="w-full">Add Event</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(event.event_date), 'PPP')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
