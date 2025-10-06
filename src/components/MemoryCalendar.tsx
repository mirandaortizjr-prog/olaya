import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Heart, Cake, Gift, Sparkles, Star, Trash2, Plus, CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MemoryEvent {
  id: string;
  created_by: string;
  title: string;
  date: string;
  event_type: string;
  notes: string | null;
  recurring: boolean;
  created_at: string;
}

interface MemoryCalendarProps {
  coupleId: string;
  userId: string;
  partnerName?: string;
}

const eventTypes = [
  { type: 'anniversary', icon: Heart, color: 'bg-red-500/20 text-red-600', emoji: '💕' },
  { type: 'birthday', icon: Cake, color: 'bg-pink-500/20 text-pink-600', emoji: '🎂' },
  { type: 'first_date', icon: Sparkles, color: 'bg-purple-500/20 text-purple-600', emoji: '✨' },
  { type: 'first_kiss', icon: Heart, color: 'bg-rose-500/20 text-rose-600', emoji: '💋' },
  { type: 'engagement', icon: Star, color: 'bg-yellow-500/20 text-yellow-600', emoji: '💍' },
  { type: 'custom', icon: Gift, color: 'bg-blue-500/20 text-blue-600', emoji: '🎁' },
];

export const MemoryCalendar = ({ coupleId, userId, partnerName }: MemoryCalendarProps) => {
  const [memories, setMemories] = useState<MemoryEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAllMemories, setShowAllMemories] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [eventType, setEventType] = useState("anniversary");
  const [notes, setNotes] = useState("");
  const [recurring, setRecurring] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchMemories();

    const channel = supabase
      .channel('memory_calendar_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memory_calendar',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          fetchMemories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from('memory_calendar')
      .select('*')
      .eq('couple_id', coupleId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching memories:', error);
      return;
    }

    setMemories((data as MemoryEvent[]) || []);
  };

  const addMemory = async () => {
    if (!title.trim() || !date) {
      toast({
        title: t('error'),
        description: t('pleaseFillRequiredFields'),
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('memory_calendar')
      .insert({
        couple_id: coupleId,
        created_by: userId,
        title: title.trim(),
        date,
        event_type: eventType,
        notes: notes.trim() || null,
        recurring
      });

    if (error) {
      console.error('Error adding memory:', error);
      toast({
        title: t('error'),
        description: t('failedToAddMemory'),
        variant: "destructive"
      });
      return;
    }

    setShowAddForm(false);
    setTitle("");
    setDate("");
    setEventType("anniversary");
    setNotes("");
    setRecurring(false);
    toast({
      title: t('success'),
      description: t('memoryAdded')
    });
  };

  const deleteMemory = async (memoryId: string) => {
    const { error } = await supabase
      .from('memory_calendar')
      .delete()
      .eq('id', memoryId)
      .eq('created_by', userId);

    if (error) {
      console.error('Error deleting memory:', error);
      toast({
        title: t('error'),
        description: t('failedToDelete'),
        variant: "destructive"
      });
    }
  };

  const getEventConfig = (type: string) => {
    return eventTypes.find(e => e.type === type) || eventTypes[0];
  };

  const getDaysUntil = (eventDate: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);
    
    const diffTime = event.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return t('passed');
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('tomorrow');
    return `${diffDays} ${t('daysAway')}`;
  };

  const getMemoriesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return memories.filter(m => m.date === dateStr);
  };

  const hasMemoryOnDate = (date: Date) => {
    return getMemoriesForDate(date).length > 0;
  };

  const selectedDateMemories = selectedDate ? getMemoriesForDate(selectedDate) : [];

  const upcomingMemories = memories.filter(m => {
    const eventDate = new Date(m.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= now;
  }).slice(0, 5);

  // For all memories view, show in reverse chronological order (most recent first)
  const allMemoriesSorted = [...memories].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            {t('memoryCalendar')}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setShowCalendar(!showCalendar)}
              variant={showCalendar ? "default" : "outline"}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              {showCalendar ? t('hideCalendar') : t('showCalendar')}
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              variant={showAddForm ? "outline" : "default"}
            >
              {showAddForm ? t('cancel') : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('addMemory')}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar View */}
        {showCalendar && (
          <div className="space-y-4 p-4 border rounded-lg bg-card/50">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={cn("rounded-md border pointer-events-auto mx-auto")}
              modifiers={{
                hasMemory: (date) => hasMemoryOnDate(date)
              }}
              modifiersStyles={{
                hasMemory: {
                  backgroundColor: 'hsl(var(--primary) / 0.2)',
                  fontWeight: 'bold',
                  color: 'hsl(var(--primary))'
                }
              }}
            />
            
            {/* Memories on selected date */}
            {selectedDate && selectedDateMemories.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {t('memoriesOn')} {format(selectedDate, 'MMMM d, yyyy')}
                </p>
                {selectedDateMemories.map((memory) => {
                  const config = getEventConfig(memory.event_type);
                  return (
                    <div
                      key={memory.id}
                      className={cn("p-3 rounded-lg border", config.color)}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{config.emoji}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{memory.title}</p>
                          {memory.notes && (
                            <p className="text-xs mt-1 opacity-80">{memory.notes}</p>
                          )}
                        </div>
                        {memory.created_by === userId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMemory(memory.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {selectedDate && selectedDateMemories.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {t('noMemoriesOnDate')}
              </p>
            )}
          </div>
        )}

        {/* Add Memory Form */}
        {showAddForm && (
          <div className="space-y-4 p-4 border rounded-lg animate-fade-in">
            <div className="space-y-2">
              <Label>{t('eventType')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {eventTypes.map((type) => (
                  <Button
                    key={type.type}
                    variant={eventType === type.type ? "default" : "outline"}
                    className={cn("h-auto flex-col gap-1 py-2", type.color)}
                    onClick={() => setEventType(type.type)}
                  >
                    <span className="text-xl">{type.emoji}</span>
                    <span className="text-xs">{t(`eventType_${type.type}` as any)}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">{t('eventTitle')}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('eventTitlePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{t('date')}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('notesOptional')}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('addNotesAboutMemory')}
                className="min-h-[80px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="recurring" className="cursor-pointer">
                {t('repeatYearly')}
              </Label>
            </div>

            <Button onClick={addMemory} className="w-full">
              {t('saveMemory')}
            </Button>
          </div>
        )}

        {/* Upcoming Memories */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{t('upcomingMemories')}</p>
            {memories.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAllMemories(!showAllMemories)}
              >
                {showAllMemories ? t('showLess') : t('viewAllMemories')}
              </Button>
            )}
          </div>
          {memories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t('noMemoriesYet')}
            </div>
          ) : upcomingMemories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t('noUpcomingMemories')}
            </div>
          ) : (
            <div className="space-y-2">
              {(showAllMemories ? allMemoriesSorted : upcomingMemories).map((memory) => {
                const config = getEventConfig(memory.event_type);
                return (
                  <div
                    key={memory.id}
                    className={cn(
                      "p-4 rounded-lg border-2",
                      config.color,
                      "transition-all"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{config.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{memory.title}</p>
                            {memory.recurring && (
                              <span className="text-xs px-2 py-0.5 bg-primary/10 rounded">
                                {t('yearly')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(memory.date), 'MMMM d, yyyy')} • {getDaysUntil(memory.date)}
                          </p>
                          {memory.notes && (
                            <p className="text-sm mt-2 opacity-80">{memory.notes}</p>
                          )}
                        </div>
                      </div>
                      {memory.created_by === userId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMemory(memory.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All Memories Count */}
        {!showAllMemories && memories.length > 5 && (
          <p className="text-xs text-center text-muted-foreground">
            Showing {upcomingMemories.length} of {memories.length} memories
          </p>
        )}
      </CardContent>
    </Card>
  );
};