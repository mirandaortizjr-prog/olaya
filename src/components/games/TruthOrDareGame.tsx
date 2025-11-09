import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Timer, Trophy, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";

interface GameProps {
  coupleId: string;
  userId: string;
  onBack: () => void;
}

interface Challenge {
  id: string;
  type: 'truth' | 'dare';
  question: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'pending' | 'completed' | 'failed';
}

const truthQuestions = [
  "What's your biggest fantasy you've never shared?",
  "What's the most romantic thing you've ever done?",
  "What's one thing about me that turns you on the most?",
  "What's a secret desire you have for us to try together?",
  "When did you first know you were attracted to me?",
  "What's the most adventurous thing you'd like to try?",
  "What's your favorite memory of us together?",
  "What makes you feel most loved by me?",
];

const dareQuestions = [
  "Send me a flirty text right now",
  "Do 10 push-ups and send me a video",
  "Tell me three things you love about me",
  "Share a secret you've been keeping",
  "Dance for 30 seconds wherever you are",
  "Give me a sincere compliment",
  "Share your current location with me",
  "Send me a voice note saying why you love me",
];

export const TruthOrDareGame = ({ coupleId, userId, onBack }: GameProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addCoins } = useTogetherCoins(userId);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [hasEarnedToday, setHasEarnedToday] = useState(false);

  useEffect(() => {
    checkDailyReward();
    loadActiveChallenge();
  }, []);

  useEffect(() => {
    if (!currentChallenge || currentChallenge.status !== 'pending') return;

    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, currentChallenge.expiresAt.getTime() - now.getTime());
      setTimeRemaining(remaining);

      if (remaining === 0) {
        handleChallengeFailed();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentChallenge]);

  const checkDailyReward = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('coin_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('transaction_type', 'truth_or_dare_daily')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .maybeSingle();

    setHasEarnedToday(!!data);
  };

  const loadActiveChallenge = async () => {
    const { data } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'truth_or_dare')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      const metadata = data.session_id ? JSON.parse(data.session_id) : {};
      setCurrentChallenge({
        id: data.id,
        type: metadata.type || 'truth',
        question: metadata.question || '',
        createdAt: new Date(data.created_at),
        expiresAt: new Date(metadata.expiresAt),
        status: 'pending',
      });
    }
  };

  const startChallenge = async (type: 'truth' | 'dare') => {
    const questions = type === 'truth' ? truthQuestions : dareQuestions;
    const question = questions[Math.floor(Math.random() * questions.length)];
    const timeLimit = type === 'truth' ? 10 * 60 * 1000 : 15 * 60 * 1000;
    const expiresAt = new Date(Date.now() + timeLimit);

    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        couple_id: coupleId,
        initiated_by: userId,
        partner_id: userId,
        game_type: 'truth_or_dare',
        status: 'pending',
        session_id: JSON.stringify({ type, question, expiresAt }),
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to start challenge",
        variant: "destructive",
      });
      return;
    }

    setCurrentChallenge({
      id: data.id,
      type,
      question,
      createdAt: new Date(),
      expiresAt,
      status: 'pending',
    });
  };

  const handleChallengeComplete = async () => {
    if (!currentChallenge) return;

    await supabase
      .from('game_sessions')
      .update({ status: 'completed' })
      .eq('id', currentChallenge.id);

    if (!hasEarnedToday) {
      await addCoins(5, 'Daily Truth or Dare completed', coupleId);
      setHasEarnedToday(true);
      toast({
        title: "🎉 Challenge Completed!",
        description: "You earned 5 Together Coins!",
      });
    } else {
      toast({
        title: "✅ Challenge Completed!",
        description: "Great job! (Daily coins already earned)",
      });
    }

    setCurrentChallenge(null);
  };

  const handleChallengeFailed = async () => {
    if (!currentChallenge) return;

    await supabase
      .from('game_sessions')
      .update({ status: 'failed' })
      .eq('id', currentChallenge.id);

    toast({
      title: "⏰ Time's Up!",
      description: "Challenge failed. Try again!",
      variant: "destructive",
    });

    setCurrentChallenge(null);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">Truth or Dare</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {currentChallenge ? (
          <div className="space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-primary" />
                  <span className="text-lg font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentChallenge.type === 'truth' 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {currentChallenge.type.toUpperCase()}
                </div>
              </div>

              <div className="text-center py-8">
                <p className="text-2xl font-medium mb-2">{currentChallenge.question}</p>
                <p className="text-sm text-muted-foreground">
                  {currentChallenge.type === 'truth' 
                    ? 'Answer within 10 minutes' 
                    : 'Complete within 15 minutes'}
                </p>
              </div>

              <Button 
                onClick={handleChallengeComplete}
                className="w-full"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                I've Completed It!
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-6 max-w-md mx-auto">
            <Card className="p-6 text-center space-y-2">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Daily Reward</h3>
              <p className="text-sm text-muted-foreground">
                Complete your first Truth or Dare today to earn 5 coins!
              </p>
              {hasEarnedToday && (
                <div className="text-green-500 text-sm font-medium">
                  ✓ Already earned today
                </div>
              )}
            </Card>

            <div className="space-y-4">
              <Button 
                onClick={() => startChallenge('truth')}
                className="w-full h-24 text-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-2 border-blue-500/50"
                variant="outline"
              >
                TRUTH
                <div className="text-xs text-muted-foreground ml-2">(10 min)</div>
              </Button>

              <Button 
                onClick={() => startChallenge('dare')}
                className="w-full h-24 text-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/50"
                variant="outline"
              >
                DARE
                <div className="text-xs text-muted-foreground ml-2">(15 min)</div>
              </Button>
            </div>

            <Card className="p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Rules:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Truth: Answer within 10 minutes</li>
                <li>Dare: Complete within 15 minutes</li>
                <li>First completion each day earns 5 coins</li>
                <li>Play unlimited times for fun!</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
