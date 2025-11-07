import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Bell, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateHowWellQuestions, calculateExperienceGain } from "@/lib/gameQuestions";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";

interface HowWellGameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

export const HowWellGame = ({ coupleId, userId, partnerId, onBack }: HowWellGameProps) => {
  const [gameMode, setGameMode] = useState<"menu" | "answer" | "guess" | "results">("menu");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [myAnswer, setMyAnswer] = useState("");
  const [myGuess, setMyGuess] = useState("");
  const [sessionId] = useState(() => `hw-${Date.now()}`);
  const [score, setScore] = useState(0);
  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, string>>({});
  const [pendingInvitation, setPendingInvitation] = useState<any>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { progress, addExperience } = useCoupleProgress(coupleId);

  useEffect(() => {
    // Generate questions based on current level
    const levelQuestions = generateHowWellQuestions(progress.currentLevel, language);
    setQuestions(levelQuestions);
  }, [progress.currentLevel, language]);

  const loadPartnerAnswers = async () => {
    if (!partnerId) return;

    const { data } = await supabase
      .from('game_responses')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'how-well')
      .eq('user_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(questions.length);

    if (data) {
      const answers: Record<string, string> = {};
      data.forEach(r => {
        answers[r.question_id] = r.answer;
      });
      setPartnerAnswers(answers);
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
    setGameMode("answer");
  };

  const saveAnswer = async () => {
    if (!myAnswer.trim()) return;

    await supabase.from('game_responses').insert({
      couple_id: coupleId,
      user_id: userId,
      game_type: 'how-well',
      question_id: `q${currentQuestionIndex}`,
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

    const partnerAnswer = partnerAnswers[`q${currentQuestionIndex}`];
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
      // Calculate experience based on score
      const expGained = calculateExperienceGain('how-well', score + (isCorrect ? 1 : 0), questions.length);
      await addExperience(expGained);
      setGameMode("results");
    }
  };

  useEffect(() => {
    loadPartnerAnswers();
    checkPendingInvitations();
  }, []);

  useEffect(() => {
    if (gameMode === "guess") {
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

            <Card className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">{t('chooseYourRole')}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('chooseRoleDescription')}
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    sendGameInvitation();
                    setGameMode("answer");
                  }}
                >
                  {t('illAnswerQuestions')}
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setGameMode("guess")}
                  disabled={!partnerId || Object.keys(partnerAnswers).length === 0}
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
              <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]}</h3>
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
              <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]}</h3>
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
