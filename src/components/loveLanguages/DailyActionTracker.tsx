import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Heart, Sparkles, Clock, Zap } from 'lucide-react';
import { getDailyAction, DailyAction } from '@/lib/loveLanguages/dailyActions';
import { LoveLanguageScore } from '@/lib/loveLanguages/scoring';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DailyActionTrackerProps {
  userId: string;
  rankedLanguages: LoveLanguageScore[];
}

export const DailyActionTracker = ({ userId, rankedLanguages }: DailyActionTrackerProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentDay, setCurrentDay] = useState(1);
  const [todayAction, setTodayAction] = useState<DailyAction | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastActionDate, setLastActionDate] = useState<string | null>(null);

  useEffect(() => {
    loadDailyProgress();
  }, [userId]);

  const loadDailyProgress = async () => {
    const { data } = await supabase
      .from('love_languages')
      .select('current_day, last_action_date')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      const day = data.current_day || 1;
      setCurrentDay(day);
      setLastActionDate(data.last_action_date);

      // Check if action was completed today
      const today = new Date().toISOString().split('T')[0];
      setIsCompleted(data.last_action_date === today);

      // Get today's action
      const action = getDailyAction(day, rankedLanguages);
      setTodayAction(action);
    }
  };

  const markAsComplete = async () => {
    const today = new Date().toISOString().split('T')[0];
    const nextDay = currentDay >= 365 ? 1 : currentDay + 1;

    const { error } = await supabase
      .from('love_languages')
      .update({
        current_day: nextDay,
        last_action_date: today
      })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark action as complete',
        variant: 'destructive'
      });
      return;
    }

    setIsCompleted(true);
    toast({
      title: '💝 Action Completed!',
      description: `Day ${currentDay}/365 complete! Come back tomorrow for your next action.`
    });
  };

  const skipToNextDay = async () => {
    const nextDay = currentDay >= 365 ? 1 : currentDay + 1;
    const action = getDailyAction(nextDay, rankedLanguages);
    
    setCurrentDay(nextDay);
    setTodayAction(action);
    setIsCompleted(false);

    await supabase
      .from('love_languages')
      .update({ current_day: nextDay })
      .eq('user_id', userId);
  };

  if (!todayAction) return null;

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    challenging: 'bg-red-500/20 text-red-700 dark:text-red-400'
  };

  const timeIcons = {
    '5min': '⚡',
    '15min': '🕐',
    '30min': '🕑',
    '1hour': '🕒',
    '2hours+': '🕓'
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">365 Days of Love</h3>
              <p className="text-muted-foreground">
                Day {currentDay} of 365
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{Math.round((currentDay / 365) * 100)}%</div>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-muted rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
              style={{ width: `${(currentDay / 365) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Today's Action */}
      <Card className={isCompleted ? 'bg-green-500/5 border-green-500/30' : 'bg-card'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              {isCompleted ? "Today's Action - Completed! ✓" : "Today's Action"}
            </CardTitle>
            <div className="flex gap-2">
              <Badge className={difficultyColors[todayAction.difficulty]}>
                {todayAction.difficulty}
              </Badge>
              <Badge variant="outline">
                {timeIcons[todayAction.timeRequired]} {todayAction.timeRequired}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-lg leading-relaxed">
              {todayAction.action[language as 'en' | 'es']}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>
              Focused on your {rankedLanguages.find(l => l.language === todayAction.language)?.rank === 1 ? 'primary' : 
              rankedLanguages.find(l => l.language === todayAction.language)?.rank === 2 ? 'secondary' : 'tertiary'} love language
            </span>
          </div>

          {!isCompleted ? (
            <Button
              onClick={markAsComplete}
              className="w-full"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Mark as Complete
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-4">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-semibold">Completed for today!</span>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Come back tomorrow for your next action
              </p>
              <Button
                onClick={skipToNextDay}
                variant="outline"
                className="w-full"
              >
                Preview Tomorrow's Action
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{currentDay}</div>
            <div className="text-xs text-muted-foreground">Current Day</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{currentDay - 1}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{365 - currentDay + 1}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
