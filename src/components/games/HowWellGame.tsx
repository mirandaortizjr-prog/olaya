import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Bell, Star, Coins, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateHowWellQuestions, calculateExperienceGain } from "@/lib/gameQuestions";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface HowWellGameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

export const HowWellGame = ({ coupleId, userId, partnerId, onBack }: HowWellGameProps) => {
  const [gameMode, setGameMode] = useState<"menu" | "answer" | "guess" | "results">("menu");
  const [questions, setQuestions] = useState<Array<{ id: string; text: string }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [myAnswer, setMyAnswer] = useState("");
  const [myGuess, setMyGuess] = useState("");
  const [sessionId] = useState(() => `hw-${Date.now()}`);
  const [score, setScore] = useState(0);
  const [partnerAnswers, setPartnerAnswers] = useState<Array<{ questionId: string; questionText: string; answer: string }>>([]);
  const [pendingInvitation, setPendingInvitation] = useState<any>(null);
  const [partnerScores, setPartnerScores] = useState<Array<{ score: number; total: number; date: string }>>([]);
  const [canPlayToday, setCanPlayToday] = useState(true);
  const [weeklyCoins, setWeeklyCoins] = useState(0);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { progress, addExperience } = useCoupleProgress(coupleId);
  const { addCoins } = useTogetherCoins(userId);

  useEffect(() => {
    // Generate questions based on current level
    const levelQuestions = generateHowWellQuestions(progress.currentLevel, language);
    // Map to include both id and text
    const formattedQuestions = levelQuestions.map((q, idx) => ({
      id: `q${idx + 1}`,
      text: q
    }));
    setQuestions(formattedQuestions);
    checkDailyLimit();
    checkWeeklyCoins();
  }, [progress.currentLevel, language]);

  const checkDailyLimit = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from('game_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('game_type', 'how-well')
      .gte('completed_at', today.toISOString())
      .limit(1);

    setCanPlayToday(!data || data.length === 0);
  };

  const checkWeeklyCoins = async () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const { data } = await supabase
      .from('game_completions')
      .select('coins_earned')
      .eq('user_id', userId)
      .eq('game_type', 'how-well')
      .gte('completed_at', weekStart.toISOString());

    const total = data?.reduce((sum, item) => sum + item.coins_earned, 0) || 0;
    setWeeklyCoins(total);
  };

  const loadPartnerAnswers = async () => {
    if (!partnerId) return;

    const { data } = await supabase
      .from('game_responses')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'how-well')
      .eq('user_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && data.length > 0) {
      const partnerQuestionAnswers = data.reverse().map((r, idx) => ({
        questionId: r.question_id,
        questionText: r.question_id, // The question text is stored in question_id
        answer: r.answer
      }));
      
      setPartnerAnswers(partnerQuestionAnswers);
      
      // Also update questions array to show partner's questions
      const formattedQuestions = partnerQuestionAnswers.map((qa, idx) => ({
        id: `q${idx + 1}`,
        text: qa.questionText
      }));
      setQuestions(formattedQuestions);
    }
  };

  const checkPendingInvitations = async () => {
    if (!partnerId) return;

    const { data } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('partner_id', userId)
      .eq('game_type', 'how-well')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setPendingInvitation(data);
    }
  };

  const loadPartnerScores = async () => {
    if (!partnerId) return;

    // Get my answers
    const { data: myAnswers } = await supabase
      .from('game_responses')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'how-well')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!myAnswers || myAnswers.length === 0) return;

    // Get partner's guesses (their answers to the same session)
    const uniqueSessions = [...new Set(myAnswers.map(a => a.session_id))].slice(0, 3);
    
    const scores: Array<{ score: number; total: number; date: string }> = [];

    for (const sessionId of uniqueSessions) {
      const mySessionAnswers = myAnswers.filter(a => a.session_id === sessionId);
      
      const { data: partnerGuesses } = await supabase
        .from('game_responses')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('game_type', 'how-well')
        .eq('user_id', partnerId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (partnerGuesses && partnerGuesses.length > 0) {
        let correctCount = 0;
        mySessionAnswers.forEach(myAnswer => {
          // Match by actual question text (stored in question_id)
          const partnerGuess = partnerGuesses.find(pg => 
            pg.question_id === myAnswer.question_id
          );
          if (partnerGuess && 
              partnerGuess.answer.toLowerCase().trim() === myAnswer.answer.toLowerCase().trim()) {
            correctCount++;
          }
        });

        if (correctCount > 0 || mySessionAnswers.length > 0) {
          scores.push({
            score: correctCount,
            total: mySessionAnswers.length,
            date: mySessionAnswers[0].created_at
          });
        }
      }
    }

    setPartnerScores(scores);
  };

  const sendGameInvitation = async () => {
    if (!partnerId) return;

    const { error } = await supabase
      .from('game_sessions')
      .insert({
        couple_id: coupleId,
        game_type: 'how-well',
        initiated_by: userId,
        partner_id: partnerId,
        session_id: sessionId,
        status: 'pending'
      });

    if (error) {
      toast({ title: t('error'), variant: "destructive" });
      return;
    }

    try {
      await supabase.functions.invoke('send-push-notification', {
        body: {
          userId: partnerId,
          title: t('gameInvitationTitle'),
          body: t('gameInvitationBody'),
          data: { type: 'game_invitation', gameType: 'how-well', sessionId }
        }
      });
    } catch (e) {
      console.error('Failed to send notification:', e);
    }

    toast({ title: t('invitationSent') });
  };

  const acceptInvitation = async () => {
    if (!pendingInvitation) return;

    await supabase
      .from('game_sessions')
      .update({ status: 'active' })
      .eq('id', pendingInvitation.id);

    setPendingInvitation(null);
    setCurrentQuestionIndex(0);
    await loadPartnerAnswers();
    setGameMode("guess");
  };

  const saveAnswer = async () => {
    if (!myAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Store the actual question text as the question_id to ensure matching works
    await supabase.from('game_responses').insert({
      couple_id: coupleId,
      user_id: userId,
      game_type: 'how-well',
      question_id: currentQuestion.text,
      answer: myAnswer.trim(),
      session_id: sessionId
    });

    setMyAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (partnerId) {
        try {
          await supabase.functions.invoke('send-push-notification', {
            body: {
              userId: partnerId,
              title: t('gameReadyTitle'),
              body: t('gameReadyBody'),
              data: { type: 'game_ready', gameType: 'how-well' }
            }
          });
        } catch (e) {
          console.error('Failed to send notification:', e);
        }
      }
      toast({ title: t('answersSaved') });
      onBack();
    }
  };

  const checkGuess = async () => {
    if (!myGuess.trim() || !partnerId) return;

    // Use the current index to find the partner's answer
    const currentPartnerAnswer = partnerAnswers[currentQuestionIndex];
    const partnerAnswer = currentPartnerAnswer?.answer;
    const isCorrect = myGuess.trim().toLowerCase() === partnerAnswer?.toLowerCase();

    if (isCorrect) {
      setScore(score + 1);
      toast({ title: t('correctAnswer'), description: "+1 " + t('point') });
    } else {
      toast({ 
        title: t('notQuite'), 
        description: `${t('theirAnswer')}: ${partnerAnswer}`,
        variant: "destructive" 
      });
    }

    setMyGuess("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      await gradeAndReward(finalScore);
      setGameMode("results");
    }
  };

  const gradeAndReward = async (finalScore: number) => {
    // Calculate experience
    const accuracy = finalScore / questions.length;
    const resultType = accuracy >= 0.8 ? 'correct' : accuracy >= 0.5 ? 'partial' : 'incorrect';
    const expGained = calculateExperienceGain(progress.currentLevel, resultType);
    await addExperience(expGained);

    // Check if both partners got perfect scores
    let coinsEarned = 0;
    if (finalScore === questions.length && partnerId) {
      // Check partner's most recent game completion
      const { data: partnerCompletion } = await supabase
        .from('game_completions')
        .select('*')
        .eq('user_id', partnerId)
        .eq('game_type', 'how-well')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (partnerCompletion && partnerCompletion.score === partnerCompletion.total_questions) {
        coinsEarned = 10;
        await addCoins(10, 'Perfect score on How Well game', coupleId);
        toast({ 
          title: '🎉 Perfect Match!', 
          description: 'Both of you scored 10/10! You earned 10 coins!',
          duration: 5000
        });
      }
    }

    // Save completion
    await supabase.from('game_completions').insert({
      couple_id: coupleId,
      user_id: userId,
      game_type: 'how-well',
      session_id: sessionId,
      score: finalScore,
      total_questions: questions.length,
      coins_earned: coinsEarned
    });

    await checkDailyLimit();
    await checkWeeklyCoins();
  };

  useEffect(() => {
    loadPartnerAnswers();
    checkPendingInvitations();
    loadPartnerScores();
  }, []);

  useEffect(() => {
    if (gameMode === "guess") {
      setCurrentQuestionIndex(0);
      loadPartnerAnswers();
    }
  }, [gameMode]);

  if (gameMode === "menu") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{t('howWellGame')}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">{t('level')} {progress.currentLevel}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="max-w-md w-full space-y-4">
            {/* Level Progress Card */}
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('coupleLevel')}: {progress.currentLevel}</span>
                  <span>{progress.totalExperience}/{progress.experienceForNextLevel} {t('experience')}</span>
                </div>
                <Progress value={(progress.totalExperience / progress.experienceForNextLevel) * 100} />
              </div>
            </Card>

            {pendingInvitation && (
              <Card className="p-6 border-primary bg-primary/5">
                <div className="flex items-start gap-3 mb-4">
                  <Bell className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('gameInvitation')}</h3>
                    <p className="text-sm text-muted-foreground">{t('partnerInvitedYou')}</p>
                  </div>
                </div>
                <Button onClick={acceptInvitation} className="w-full">
                  {t('acceptAndStart')}
                </Button>
              </Card>
            )}

            {partnerScores.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  {t('partnerRecentScores')}
                </h3>
                <div className="space-y-2">
                  {partnerScores.map((scoreData, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold text-lg">
                          {scoreData.score}/{scoreData.total}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(scoreData.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {Math.round((scoreData.score / scoreData.total) * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('accuracy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Game Instructions */}
            <Card className="p-6 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{t('howToPlay')}</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• <strong>{t('answerMode')}</strong> {t('answerModeDesc')}</li>
                    <li>• <strong>{t('guessMode')}</strong> {t('guessModeDesc')}</li>
                    <li>• <strong>{t('perfectScore')}</strong> {t('perfectScoreDesc')}</li>
                    <li>• <strong>{t('dailyLimit')}</strong> {t('dailyLimitDesc')}</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Coins Progress */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">{t('weeklyProgress')}</span>
                </div>
                <span className="text-sm text-muted-foreground">{weeklyCoins}/70 {t('shopTogetherCoins').toLowerCase()}</span>
              </div>
              <Progress value={(weeklyCoins / 70) * 100} className="h-2" />
              {!canPlayToday && (
                <p className="text-xs text-muted-foreground mt-2">{t('comeBackTomorrow')}</p>
              )}
            </Card>

            <Card className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">{t('chooseYourRole')}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('selectRoleDesc')}
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    sendGameInvitation();
                    setGameMode("answer");
                  }}
                  disabled={!canPlayToday}
                >
                  {t('illAnswerQuestions')}
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setGameMode("guess")}
                  disabled={!canPlayToday || !partnerId || Object.keys(partnerAnswers).length === 0}
                >
                  {t('illGuessAnswers')}
                </Button>
                {!partnerId && (
                  <p className="text-xs text-muted-foreground text-center">
                    {t('waitingForPartner')}
                  </p>
                )}
                {partnerId && Object.keys(partnerAnswers).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    {t('waitingPartnerAnswers')}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "answer") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setGameMode("menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('question')} {currentQuestionIndex + 1}/{questions.length}</h2>
          <div className="flex items-center gap-1 text-sm ml-auto">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{t('level')} {progress.currentLevel}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]?.text}</h3>
              <div className="space-y-4">
                <div>
                  <Label>{t('yourAnswer')}</Label>
                  <Input
                    value={myAnswer}
                    onChange={(e) => setMyAnswer(e.target.value)}
                    placeholder={t('typeYourAnswer')}
                    onKeyPress={(e) => e.key === 'Enter' && saveAnswer()}
                  />
                </div>
                <Button onClick={saveAnswer} className="w-full" disabled={!myAnswer.trim()}>
                  {currentQuestionIndex < questions.length - 1 ? t('nextQuestion') : t('finish')}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "guess") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setGameMode("menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('guess')} {currentQuestionIndex + 1}/{questions.length}</h2>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Card className="p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">{t('score')}: {score}/{currentQuestionIndex}</p>
              </div>
              <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]?.text}</h3>
              <div className="space-y-4">
                <div>
                  <Label>{t('yourGuess')}</Label>
                  <Input
                    value={myGuess}
                    onChange={(e) => setMyGuess(e.target.value)}
                    placeholder={t('guessPlaceholder')}
                    onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
                  />
                </div>
                <Button onClick={checkGuess} className="w-full" disabled={!myGuess.trim()}>
                  {t('submitGuess')}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">{t('results')}</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <Card className="p-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold mb-2">{t('gameComplete')}</h3>
            <p className="text-4xl font-bold text-primary mb-4">{score}/{questions.length}</p>
            <p className="text-muted-foreground mb-6">
              {score >= 7 ? t('amazing') :
               score >= 5 ? t('greatJob') :
               t('keepPlaying')}
            </p>
            <Button onClick={onBack} className="w-full">{t('playAgain')}</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
