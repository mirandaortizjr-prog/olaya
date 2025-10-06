import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Heart, Sparkles, Zap, Coffee, Mountain, AlertCircle, Moon, Gift, Flame, Battery, Frown, CloudRain, Laugh, Annoyed, HeartCrack, Brain, Smile } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Mood {
  id: string;
  user_id: string;
  mood_type: string;
  note?: string;
  created_at: string;
}

interface MoodTrackerProps {
  coupleId: string;
  userId: string;
  partnerName?: string;
}

const moodConfigs = [
  { type: 'tender', icon: Heart, color: 'bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30 text-pink-600', emoji: '💕' },
  { type: 'playful', icon: Sparkles, color: 'bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30 text-yellow-600', emoji: '🎮' },
  { type: 'loving', icon: Flame, color: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-600', emoji: '❤️' },
  { type: 'peaceful', icon: Moon, color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-600', emoji: '🌙' },
  { type: 'excited', icon: Zap, color: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 text-orange-600', emoji: '⚡' },
  { type: 'happy', icon: Laugh, color: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-600', emoji: '😊' },
  { type: 'horny', icon: Flame, color: 'bg-fuchsia-600/10 hover:bg-fuchsia-600/20 border-fuchsia-600/30 text-fuchsia-700', emoji: '🔥' },
  { type: 'sad', icon: Frown, color: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-600', emoji: '😢' },
  { type: 'worried', icon: Brain, color: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 text-violet-600', emoji: '😟' },
  { type: 'anxious', icon: CloudRain, color: 'bg-slate-500/10 hover:bg-slate-500/20 border-slate-500/30 text-slate-600', emoji: '😰' },
  { type: 'frustrated', icon: Annoyed, color: 'bg-red-600/10 hover:bg-red-600/20 border-red-600/30 text-red-700', emoji: '😤' },
  { type: 'heartbroken', icon: HeartCrack, color: 'bg-pink-600/10 hover:bg-pink-600/20 border-pink-600/30 text-pink-700', emoji: '💔' },
  { type: 'content', icon: Smile, color: 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30 text-teal-600', emoji: '😌' },
  { type: 'stressed', icon: AlertCircle, color: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-600', emoji: '😫' },
  { type: 'needSpace', icon: Mountain, color: 'bg-gray-500/10 hover:bg-gray-500/20 border-gray-500/30 text-gray-600', emoji: '🌲' },
  { type: 'grateful', icon: Gift, color: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-600', emoji: '🙏' },
  { type: 'romantic', icon: Heart, color: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-600', emoji: '🌹' },
  { type: 'energetic', icon: Battery, color: 'bg-lime-500/10 hover:bg-lime-500/20 border-lime-500/30 text-lime-600', emoji: '⚡' },
];

export const MoodTracker = ({ coupleId, userId, partnerName }: MoodTrackerProps) => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchLatestMoods();

    const channel = supabase
      .channel('mood_tracker_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mood_tracker',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          fetchLatestMoods();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchLatestMoods = async () => {
    // Get the latest mood for each user
    const { data, error } = await supabase
      .from('mood_tracker')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching moods:', error);
      return;
    }

    // Get only the latest mood for each user
    const latestMoods: Mood[] = [];
    const userIds = new Set();
    
    data?.forEach(mood => {
      if (!userIds.has(mood.user_id)) {
        latestMoods.push(mood as Mood);
        userIds.add(mood.user_id);
      }
    });

    setMoods(latestMoods);
  };

  const updateMood = async (moodType: string) => {
    setSelectedMood(moodType);
  };

  const saveMood = async () => {
    if (!selectedMood) {
      toast({
        title: t('error'),
        description: t('selectMood'),
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('mood_tracker')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        mood_type: selectedMood,
        note: note.trim() || null
      });

    if (error) {
      console.error('Error saving mood:', error);
      toast({
        title: t('error'),
        description: t('failedToSaveMood'),
        variant: "destructive"
      });
      return;
    }

    setSelectedMood(null);
    setNote("");
    toast({
      title: t('success'),
      description: t('moodUpdated')
    });
  };

  const getUserMood = (uid: string) => moods.find(m => m.user_id === uid);
  const myMood = getUserMood(userId);
  const partnerMood = moods.find(m => m.user_id !== userId);

  const getMoodConfig = (type: string) => moodConfigs.find(m => m.type === type);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('moodTracker')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Moods Display */}
        <div className="grid grid-cols-2 gap-4">
          {/* My Mood */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t('yourMood')}</p>
            {myMood ? (
              <div className={cn("p-4 rounded-lg border-2", getMoodConfig(myMood.mood_type)?.color)}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getMoodConfig(myMood.mood_type)?.emoji}</span>
                  <span className="font-medium">{t(`mood_${myMood.mood_type}` as any)}</span>
                </div>
                {myMood.note && (
                  <p className="text-sm opacity-80">{myMood.note}</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center text-sm text-muted-foreground">
                {t('noMoodSet')}
              </div>
            )}
          </div>

          {/* Partner Mood */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{partnerName ? `${partnerName}'s ${t('mood')}` : t('partnerMood')}</p>
            {partnerMood ? (
              <div className={cn("p-4 rounded-lg border-2", getMoodConfig(partnerMood.mood_type)?.color)}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getMoodConfig(partnerMood.mood_type)?.emoji}</span>
                  <span className="font-medium">{t(`mood_${partnerMood.mood_type}` as any)}</span>
                </div>
                {partnerMood.note && (
                  <p className="text-sm opacity-80">{partnerMood.note}</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center text-sm text-muted-foreground">
                {t('noMoodSet')}
              </div>
            )}
          </div>
        </div>

        {/* Mood Selection */}
        <div className="space-y-4">
          <p className="text-sm font-medium">{t('howAreYouFeeling')}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {moodConfigs.map((mood) => (
              <Button
                key={mood.type}
                variant="outline"
                onClick={() => updateMood(mood.type)}
                className={cn(
                  "h-auto flex-col gap-1 p-3 transition-all",
                  mood.color,
                  selectedMood === mood.type && "ring-2 ring-offset-2"
                )}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{t(`mood_${mood.type}` as any)}</span>
              </Button>
            ))}
          </div>

          {selectedMood && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Textarea
                placeholder={t('addMoodNote')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button onClick={saveMood} className="flex-1">
                  {t('updateMood')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedMood(null);
                    setNote("");
                  }}
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};