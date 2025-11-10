import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, MessageSquare, Sparkles, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { generateTruthOrDareQuestions } from "@/lib/gameQuestions";

interface GameProps {
  coupleId: string;
  userId: string;
  onBack: () => void;
}

type GameMode = 'instructions' | 'choose' | 'question' | 'waiting' | 'complete' | 'finished';
type ChallengeType = 'truth' | 'tender';

interface Round {
  playerId: string;
  type: ChallengeType;
  question: string;
  answer?: string;
  completed: boolean;
  validated: boolean;
}

export const TruthOrTenderGame = ({ coupleId, userId, onBack }: GameProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { progress } = useCoupleProgress(coupleId);
  const { addCoins } = useTogetherCoins(userId);

  const [gameMode, setGameMode] = useState<GameMode>('instructions');
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>(userId);
  const [answer, setAnswer] = useState("");
  const [questions, setQuestions] = useState<Array<{ truth: string; dare: string }>>([]);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Load questions based on level
  useEffect(() => {
    const level = progress?.currentLevel || 1;
    const loadedQuestions = generateTruthOrDareQuestions(level, language);
    setQuestions(loadedQuestions);
  }, [progress, language]);

  // Check if already played today
  useEffect(() => {
    const checkPlayedToday = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('game_type', 'truth_or_tender')
        .eq('status', 'completed')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      if (!error && data && data.length > 0) {
        setHasPlayedToday(true);
      }
    };

    checkPlayedToday();
  }, [coupleId]);

  const startGame = () => {
    setGameMode('choose');
    setCurrentRound(1);
    setRounds([]);
  };

  const selectChallenge = (type: ChallengeType) => {
    if (questions.length === 0) return;

    const questionIndex = Math.floor(Math.random() * questions.length);
    const question = type === 'truth' 
      ? questions[questionIndex].truth 
      : questions[questionIndex].dare;

    const newRound: Round = {
      playerId: currentPlayerId,
      type,
      question,
      completed: false,
      validated: false
    };

    setRounds([...rounds, newRound]);
    setGameMode('question');
    setAnswer("");
  };

  const submitAnswer = async () => {
    const currentRoundData = rounds[rounds.length - 1];
    
    if (currentRoundData.type === 'truth' && !answer.trim()) {
      toast({
        title: t('error'),
        description: "Please provide an answer",
        variant: "destructive"
      });
      return;
    }

    // Update round with answer
    const updatedRounds = [...rounds];
    updatedRounds[updatedRounds.length - 1] = {
      ...currentRoundData,
      answer: answer || "Completed",
      completed: true
    };
    setRounds(updatedRounds);
    setGameMode('waiting');

    // Wait for partner validation (in real app, this would be real-time)
    // For now, simulate validation after 2 seconds
    setTimeout(() => {
      validateRound(true);
    }, 2000);
  };

  const validateRound = (isValid: boolean) => {
    setIsValidating(true);
    
    setTimeout(() => {
      const updatedRounds = [...rounds];
      updatedRounds[updatedRounds.length - 1] = {
        ...updatedRounds[updatedRounds.length - 1],
        validated: isValid
      };
      setRounds(updatedRounds);
      setIsValidating(false);

      if (isValid) {
        toast({
          title: t('roundComplete'),
          description: `${t('roundsCompleted')}: ${currentRound}/5`
        });

        if (currentRound >= 5) {
          finishGame();
        } else {
          setGameMode('complete');
        }
      } else {
        toast({
          title: "Try Again",
          description: "That round wasn't completed. Try another challenge!",
          variant: "destructive"
        });
        setGameMode('choose');
      }
    }, 1000);
  };

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
    setGameMode('choose');
    setAnswer("");
  };

  const finishGame = async () => {
    setGameMode('finished');

    // Save game session
    const { error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        couple_id: coupleId,
        initiated_by: userId,
        partner_id: userId, // In real app, get actual partner
        game_type: 'truth_or_tender',
        status: 'completed',
        session_id: `tot_${Date.now()}`
      });

    if (sessionError) {
      console.error('Error saving game session:', sessionError);
    }

    // Award coins if haven't played today
    if (!hasPlayedToday && rounds.length >= 5) {
      try {
        await addCoins(10, 'Truth or Tender game completed', coupleId);
        toast({
          title: t('earnedReward'),
          description: t('earnedReward')
        });
        setHasPlayedToday(true);
      } catch (error) {
        console.error('Error awarding coins:', error);
      }
    }
  };

  const resetGame = () => {
    setGameMode('instructions');
    setCurrentRound(0);
    setRounds([]);
    setAnswer("");
  };

  // Render instructions
  if (gameMode === 'instructions') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-pink-500/20">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('truthOrTenderSubtitle')}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('truthOrTenderHow')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('truthOrTenderObjective')}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">{t('truthOrTenderRules')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderRule1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderRule2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderRule3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderRule4')}</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold mb-3">{t('truthOrTenderRewards')}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderReward1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{t('truthOrTenderReward2')}</span>
              </li>
            </ul>
          </Card>

          {hasPlayedToday && (
            <Card className="p-4 bg-blue-500/10 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
                {t('playAgainTomorrow')}
              </p>
            </Card>
          )}
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button onClick={startGame} className="w-full" size="lg">
            {t('startNewGame') || "Start New Game"}
          </Button>
        </div>
      </div>
    );
  }

  // Render choose challenge mode
  if (gameMode === 'choose') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 p-4 flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{t('yourTurn') || "Your Turn!"}</h3>
            <p className="text-muted-foreground">
              {t('roundsCompleted')}: {currentRound - 1}/5
            </p>
          </div>

          <div className="w-full max-w-md">
            <h4 className="text-lg font-semibold text-center mb-4">{t('chooseMode') || "Choose Your Challenge"}</h4>
            
            <div className="grid gap-4">
              <Card 
                className="p-6 cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary"
                onClick={() => selectChallenge('truth')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">{t('truthMode')}</h5>
                    <p className="text-sm text-muted-foreground">{t('truthDescription')}</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-6 cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary"
                onClick={() => selectChallenge('tender')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-pink-500/20">
                    <Heart className="w-6 h-6 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">{t('tenderMode')}</h5>
                    <p className="text-sm text-muted-foreground">{t('tenderDescription')}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render question/dare
  if (gameMode === 'question') {
    const currentRoundData = rounds[rounds.length - 1];
    const isTruth = currentRoundData.type === 'truth';

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-1">
              {t('roundsCompleted')}: {currentRound}/5
            </p>
          </div>

          <Card className={`p-6 ${isTruth ? 'bg-blue-500/10 border-blue-200 dark:border-blue-800' : 'bg-pink-500/10 border-pink-200 dark:border-pink-800'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${isTruth ? 'bg-blue-500/20' : 'bg-pink-500/20'}`}>
                {isTruth ? (
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                ) : (
                  <Heart className="w-6 h-6 text-pink-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold">
                {isTruth ? t('truthQuestion') : t('tenderDare')}
              </h3>
            </div>
            <p className="text-lg">{currentRoundData.question}</p>
          </Card>

          {isTruth ? (
            <div className="space-y-3">
              <label className="text-sm font-medium">{t('answerQuestion')}</label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={t('typeYourAnswer') || "Type your answer..."}
                rows={4}
                className="resize-none"
              />
            </div>
          ) : (
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground text-center">
                {t('confirmCompleted')}
              </p>
            </Card>
          )}
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button 
            onClick={submitAnswer} 
            className="w-full" 
            size="lg"
            disabled={isTruth && !answer.trim()}
          >
            {isTruth ? t('submit') : t('confirmCompleted')}
          </Button>
        </div>
      </div>
    );
  }

  // Render waiting for validation
  if (gameMode === 'waiting') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md">
            <div className="animate-pulse mb-4">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('validating')}</h3>
            <p className="text-muted-foreground">{t('waitingForPartnerToValidate')}</p>
          </Card>
        </div>
      </div>
    );
  }

  // Render round complete
  if (gameMode === 'complete') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md">
            <div className="mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{t('roundComplete')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('roundsCompleted')}: {currentRound}/5
            </p>
            
            <div className="space-y-3">
              <Button onClick={nextRound} className="w-full" size="lg">
                {currentRound >= 5 ? t('finishGame') || "Finish Game" : t('nextRound') || "Next Round"}
              </Button>
              {currentRound >= 5 && (
                <Button onClick={finishGame} variant="outline" className="w-full">
                  {t('finishGame') || "Finish Game"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render game finished
  if (gameMode === 'finished') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('truthOrTenderTitle')}</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-200 dark:border-pink-800">
            <div className="mb-4">
              <Heart className="w-20 h-20 text-pink-500 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{t('gameCompleted') || "Game Completed!"}</h3>
            <p className="text-muted-foreground mb-6">
              {t('totalRounds') || "Total Rounds"}: {rounds.length}
            </p>
            
            {!hasPlayedToday && rounds.length >= 5 && (
              <Card className="p-4 mb-6 bg-yellow-500/10 border-yellow-200 dark:border-yellow-800">
                <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {t('earnedReward')}
                </p>
              </Card>
            )}

            {hasPlayedToday && (
              <Card className="p-4 mb-6 bg-blue-500/10 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {t('playAgainTomorrow')}
                </p>
              </Card>
            )}
            
            <Button onClick={resetGame} className="w-full" size="lg">
              {t('backToHome') || "Back to Home"}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};
