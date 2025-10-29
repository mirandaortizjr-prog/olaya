import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trophy, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HowWellGameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

const allQuestions = [
  "What's my favorite comfort food?",
  "What's one thing I always forget?",
  "If I could teleport anywhere right now, where would I go?",
  "What's my biggest pet peeve?",
  "What song makes me happy every time?",
  "What's my dream vacation destination?",
  "What would I do if I won the lottery?",
  "What's my favorite way to spend a lazy Sunday?",
  "What's my go-to karaoke song?",
  "What's the best gift I've ever received?",
  "What makes me laugh the hardest?",
  "What's my secret talent?",
  "What would my perfect day look like?",
  "What's my favorite childhood memory?",
  "What's one thing that instantly improves my mood?",
  "What's my biggest fear?",
  "What's my favorite movie or TV show?",
  "What's my ideal way to relax after a long day?",
  "What's something I'm secretly proud of?",
  "What's my favorite season and why?"
];

// Shuffle array function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const HowWellGame = ({ coupleId, userId, partnerId, onBack }: HowWellGameProps) => {
  const [gameMode, setGameMode] = useState<"menu" | "answer" | "guess" | "results">("menu");
  const [questions] = useState(() => shuffleArray(allQuestions).slice(0, 8));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [myAnswer, setMyAnswer] = useState("");
  const [myGuess, setMyGuess] = useState("");
  const [sessionId] = useState(() => `hw-${Date.now()}`);
  const [score, setScore] = useState(0);
  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, string>>({});
  const [pendingInvitation, setPendingInvitation] = useState<any>(null);
  const { toast } = useToast();

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

    // Create game session
    const { data: session, error } = await supabase
      .from('game_sessions')
      .insert({
        couple_id: coupleId,
        game_type: 'how-well',
        initiated_by: userId,
        partner_id: partnerId,
        session_id: sessionId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error sending invitation", variant: "destructive" });
      return;
    }

    // Send push notification
    try {
      await supabase.functions.invoke('send-push-notification', {
        body: {
          userId: partnerId,
          title: "How Well Do You Know Me? 🎮",
          body: "Your partner wants to play 'How Well Do You Know Me?' - Answer questions about yourself!",
          data: { type: 'game_invitation', gameType: 'how-well', sessionId }
        }
      });
    } catch (e) {
      console.error('Failed to send notification:', e);
    }

    toast({ title: "Invitation sent! 💌" });
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
      // All answers complete - notify partner
      if (partnerId) {
        try {
          await supabase.functions.invoke('send-push-notification', {
            body: {
              userId: partnerId,
              title: "How Well Do You Know Me? 🎯",
              body: "Your partner has finished answering 'How Well Do You Know Me?' - Time to guess their answers!",
              data: { type: 'game_ready', gameType: 'how-well' }
            }
          });
        } catch (e) {
          console.error('Failed to send notification:', e);
        }
      }
      toast({ title: "Answers saved! Partner notified." });
      onBack();
    }
  };

  const checkGuess = async () => {
    if (!myGuess.trim() || !partnerId) return;

    const partnerAnswer = partnerAnswers[`q${currentQuestionIndex}`];
    const isCorrect = myGuess.trim().toLowerCase() === partnerAnswer?.toLowerCase();

    if (isCorrect) {
      setScore(score + 1);
      toast({ title: "Correct! 🎉", description: "+1 point" });
    } else {
      toast({ 
        title: "Not quite!", 
        description: `Their answer: ${partnerAnswer}`,
        variant: "destructive" 
      });
    }

    setMyGuess("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
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
          <h2 className="text-xl font-semibold">How Well Do You Know Me?</h2>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="max-w-md w-full space-y-4">
            {pendingInvitation && (
              <Card className="p-6 border-primary bg-primary/5">
                <div className="flex items-start gap-3 mb-4">
                  <Bell className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Game Invitation!</h3>
                    <p className="text-sm text-muted-foreground">Your partner invited you to play</p>
                  </div>
                </div>
                <Button onClick={acceptInvitation} className="w-full">
                  Accept & Start Answering
                </Button>
              </Card>
            )}

            <Card className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Choose Your Role</h3>
              <p className="text-sm text-muted-foreground mb-6">
                One partner answers questions about themselves, the other guesses
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    sendGameInvitation();
                    setGameMode("answer");
                  }}
                >
                  I'll Answer Questions
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setGameMode("guess")}
                  disabled={!partnerId}
                >
                  I'll Guess Their Answers
                </Button>
                {!partnerId && (
                  <p className="text-xs text-muted-foreground text-center">
                    Waiting for partner to join
                  </p>
                )}
                {partnerId && Object.keys(partnerAnswers).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Waiting for partner to answer questions first
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
          <h2 className="text-xl font-semibold">Question {currentQuestionIndex + 1}/{questions.length}</h2>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]}</h3>
              <div className="space-y-4">
                <div>
                  <Label>Your Answer</Label>
                  <Input
                    value={myAnswer}
                    onChange={(e) => setMyAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    onKeyPress={(e) => e.key === 'Enter' && saveAnswer()}
                  />
                </div>
                <Button onClick={saveAnswer} className="w-full" disabled={!myAnswer.trim()}>
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish"}
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
          <h2 className="text-xl font-semibold">Guess {currentQuestionIndex + 1}/{questions.length}</h2>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Card className="p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">Score: {score}/{currentQuestionIndex}</p>
              </div>
              <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]}</h3>
              <div className="space-y-4">
                <div>
                  <Label>Your Guess</Label>
                  <Input
                    value={myGuess}
                    onChange={(e) => setMyGuess(e.target.value)}
                    placeholder="What do you think they said?"
                    onKeyPress={(e) => e.key === 'Enter' && checkGuess()}
                  />
                </div>
                <Button onClick={checkGuess} className="w-full" disabled={!myGuess.trim()}>
                  Submit Guess
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
        <h2 className="text-xl font-semibold">Results</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <Card className="p-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold mb-2">Game Complete!</h3>
            <p className="text-4xl font-bold text-primary mb-4">{score}/{questions.length}</p>
            <p className="text-muted-foreground mb-6">
              {score >= 7 ? "Amazing! You know each other so well! 💖" :
               score >= 5 ? "Great job! Keep learning about each other! 😊" :
               "Keep playing to know each other better! 💑"}
            </p>
            <Button onClick={onBack} className="w-full">Play Again</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
