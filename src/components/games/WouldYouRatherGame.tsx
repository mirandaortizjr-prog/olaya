import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Trash2, Star, Trophy, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getWouldYouRatherQuestions } from "@/lib/wouldYouRatherQuestions";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface GameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

interface CustomQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
}

interface GameQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  isCustom?: boolean;
}

interface AnswerData {
  myChoice: 'A' | 'B';
  myGuess: 'A' | 'B';
}

export const WouldYouRatherGame = ({ coupleId, userId, partnerId, onBack }: GameProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { progress } = useCoupleProgress(coupleId);
  
  const [gameMode, setGameMode] = useState<"menu" | "customize" | "play-answer" | "play-guess" | "waiting" | "compare">("menu");
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState({ question: "", optionA: "", optionB: "" });
  const [includeSpicy, setIncludeSpicy] = useState(true);
  const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myAnswers, setMyAnswers] = useState<Record<string, AnswerData>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, AnswerData>>({});
  const [sessionId] = useState(() => `wyr-${Date.now()}`);
  const [predictionScore, setPredictionScore] = useState(0);
  const [partnerReady, setPartnerReady] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<'A' | 'B' | null>(null);
  const [comparisonData, setComparisonData] = useState<Array<{
    question: GameQuestion;
    myChoice: 'A' | 'B';
    myGuess: 'A' | 'B';
    partnerChoice: 'A' | 'B' | null;
    partnerGuess: 'A' | 'B' | null;
    didIGuessRight: boolean;
    didPartnerGuessRight: boolean;
  }>>([]);

  useEffect(() => {
    loadCustomQuestions();
    loadPartnerAnswers();
    checkPartnerReadiness();
    
    // Subscribe to real-time updates for partner answers
    const channel = supabase
      .channel('wyr-game-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_responses',
          filter: `couple_id=eq.${coupleId},game_type=eq.would-you-rather`
        },
        () => {
          loadPartnerAnswers();
          checkPartnerReadiness();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadCustomQuestions = async () => {
    const { data } = await supabase
      .from('custom_game_questions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'would-you-rather')
      .order('created_at', { ascending: false });

    if (data) {
      setCustomQuestions(data.map((q: any) => ({
        id: q.id,
        question: q.question,
        optionA: q.option_a || '',
        optionB: q.option_b || ''
      })));
    }
  };

  const loadPartnerAnswers = async () => {
    if (!partnerId) return;

    const { data } = await supabase
      .from('game_responses')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'would-you-rather')
      .eq('user_id', partnerId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      const answers: Record<string, AnswerData> = {};
      data.forEach(r => {
        const meta = (r as any).metadata || {};
        answers[r.question_id] = {
          myChoice: r.answer as 'A' | 'B',
          myGuess: meta.partner_guess as 'A' | 'B' || r.answer as 'A' | 'B'
        };
      });
      setPartnerAnswers(answers);
    }
  };

  const checkPartnerReadiness = async () => {
    if (!partnerId) return;

    // Check if partner has completed their session
    const { data } = await supabase
      .from('game_completions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'would-you-rather')
      .eq('user_id', partnerId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      const lastCompleted = new Date(data.completed_at);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      setPartnerReady(lastCompleted > fiveMinutesAgo);
    }
  };

  const addCustomQuestion = async () => {
    if (!newQuestion.question.trim() || !newQuestion.optionA.trim() || !newQuestion.optionB.trim()) {
      toast({ title: t('error'), description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const { data, error } = await supabase
      .from('custom_game_questions')
      .insert({
        couple_id: coupleId,
        game_type: 'would-you-rather',
        question: newQuestion.question.trim(),
        option_a: newQuestion.optionA.trim(),
        option_b: newQuestion.optionB.trim(),
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      toast({ title: t('error'), variant: "destructive" });
      return;
    }

    if (data) {
      setCustomQuestions([...customQuestions, {
        id: data.id,
        question: (data as any).question,
        optionA: (data as any).option_a || '',
        optionB: (data as any).option_b || ''
      }]);
      setNewQuestion({ question: "", optionA: "", optionB: "" });
      toast({ title: "Custom question added!" });
    }
  };

  const deleteCustomQuestion = async (id: string) => {
    await supabase
      .from('custom_game_questions')
      .delete()
      .eq('id', id);

    setCustomQuestions(customQuestions.filter(q => q.id !== id));
    toast({ title: "Question deleted" });
  };

  const startGame = () => {
    // Get system questions
    const systemQuestions = getWouldYouRatherQuestions(
      progress.currentLevel, 
      language as 'en' | 'es',
      includeSpicy
    );

    // Combine custom and system questions
    let allQuestions: GameQuestion[] = [
      ...customQuestions.map(q => ({ ...q, isCustom: true })),
      ...systemQuestions.map(q => ({ ...q, isCustom: false }))
    ];

    // Shuffle and take 10
    allQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 10);
    
    setGameQuestions(allQuestions);
    setCurrentIndex(0);
    setMyAnswers({});
    setCurrentAnswer(null);
    setPredictionScore(0);
    setGameMode("play-answer");
  };

  const handleMyAnswer = (choice: 'A' | 'B') => {
    setCurrentAnswer(choice);
    setGameMode("play-guess");
  };

  const handleMyGuess = async (guess: 'A' | 'B') => {
    if (!currentAnswer) return;
    
    const currentQuestion = gameQuestions[currentIndex];
    
    // Save both my choice and my guess about partner
    await supabase.from('game_responses').insert({
      couple_id: coupleId,
      user_id: userId,
      game_type: 'would-you-rather',
      question_id: currentQuestion.id,
      answer: currentAnswer,
      session_id: sessionId,
      metadata: { partner_guess: guess }
    });

    const newAnswers = { 
      ...myAnswers, 
      [currentQuestion.id]: { 
        myChoice: currentAnswer, 
        myGuess: guess 
      } 
    };
    setMyAnswers(newAnswers);
    setCurrentAnswer(null);

    // Move to next question or finish
    if (currentIndex < gameQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setGameMode("play-answer");
      }, 500);
    } else {
      // Calculate prediction score
      let correctPredictions = 0;
      Object.keys(newAnswers).forEach(questionId => {
        const partnerData = partnerAnswers[questionId];
        if (partnerData && newAnswers[questionId].myGuess === partnerData.myChoice) {
          correctPredictions++;
        }
      });
      setPredictionScore(correctPredictions);

      // Save completion
      await supabase.from('game_completions').insert({
        couple_id: coupleId,
        user_id: userId,
        game_type: 'would-you-rather',
        session_id: sessionId,
        score: correctPredictions,
        total_questions: gameQuestions.length,
        coins_earned: correctPredictions >= 7 ? 5 : 0
      });

      // Notify partner
      if (partnerId) {
        try {
          await supabase.functions.invoke('send-push-notification', {
            body: {
              userId: partnerId,
              title: 'Would You Rather? 💭',
              body: `Your partner completed their Would You Rather - They guessed ${correctPredictions}/${gameQuestions.length} correctly!`,
              data: { type: 'game_ready', gameType: 'would-you-rather' }
            }
          });
        } catch (e) {
          console.error('Failed to send notification:', e);
        }
      }

      setTimeout(() => {
        if (partnerReady) {
          prepareComparison(newAnswers);
        } else {
          setGameMode("waiting");
        }
      }, 500);
    }
  };

  const prepareComparison = (answers: Record<string, AnswerData>) => {
    const comparison = gameQuestions.map(q => {
      const myData = answers[q.id];
      const partnerData = partnerAnswers[q.id];
      return {
        question: q,
        myChoice: myData.myChoice,
        myGuess: myData.myGuess,
        partnerChoice: partnerData?.myChoice || null,
        partnerGuess: partnerData?.myGuess || null,
        didIGuessRight: myData.myGuess === partnerData?.myChoice,
        didPartnerGuessRight: partnerData?.myGuess === myData.myChoice
      };
    });

    const myCorrectGuesses = comparison.filter(c => c.didIGuessRight).length;
    const partnerCorrectGuesses = comparison.filter(c => c.didPartnerGuessRight).length;
    
    setPredictionScore(myCorrectGuesses);
    setComparisonData(comparison);
    setGameMode("compare");
  };

  if (gameMode === "menu") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{t('wouldYouRather')}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">{t('level')} {progress.currentLevel}</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-md mx-auto space-y-4">
            
            {/* How to Play Instructions */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                How to Play & Win
              </h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-[24px]">1.</span>
                  <span><strong>Answer for yourself:</strong> Choose what YOU would rather do for each question.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-[24px]">2.</span>
                  <span><strong>Predict your partner:</strong> Guess what your PARTNER would choose for each question.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-[24px]">3.</span>
                  <span><strong>Win together:</strong> Get 7+ correct predictions to earn 5 coins! See your compatibility score and who knows who better.</span>
                </li>
              </ol>
              <div className="mt-4 p-3 bg-background/60 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tip:</strong> Both partners must complete the game to see results. You'll be notified when your partner finishes!
                </p>
              </div>
            </Card>

            {customQuestions.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Your Custom Questions ({customQuestions.length})</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  These will be mixed with system questions
                </p>
              </Card>
            )}

            {partnerReady && (
              <Card className="p-4 border-primary bg-primary/5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium">Partner has completed their answers - Ready to compare!</p>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="spicy">{t('wyrIncludeSpicy')}</Label>
                <Switch
                  id="spicy"
                  checked={includeSpicy}
                  onCheckedChange={setIncludeSpicy}
                />
              </div>
              {progress.currentLevel < 10 && includeSpicy && (
                <p className="text-xs text-muted-foreground">
                  Spicy questions unlock at level 10+
                </p>
              )}
            </Card>

            <div className="space-y-3">
              <Button className="w-full" onClick={startGame}>
                {t('wyrStartGame')}
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setGameMode("customize")}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('wyrCustomizeQuestions')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "customize") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setGameMode("menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">Custom Questions</h2>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-md mx-auto space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Add New Question</h3>
              <div className="space-y-4">
                <div>
                  <Label>Question</Label>
                  <Input
                    placeholder="Would you rather..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Option A</Label>
                  <Input
                    placeholder="First option"
                    value={newQuestion.optionA}
                    onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Option B</Label>
                  <Input
                    placeholder="Second option"
                    value={newQuestion.optionB}
                    onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={addCustomQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </Card>

            {customQuestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Your Questions ({customQuestions.length})</h3>
                {customQuestions.map((q) => (
                  <Card key={q.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-2">{q.question}</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>A: {q.optionA}</p>
                          <p>B: {q.optionB}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCustomQuestion(q.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "play-answer") {
    const currentQuestion = gameQuestions[currentIndex];
    const progressPercent = ((currentIndex + 1) / gameQuestions.length) * 100;

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setGameMode("menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Question {currentIndex + 1} of {gameQuestions.length}
              </span>
              <span className="text-sm text-primary font-semibold">
                Step 1: Your Choice
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6">
            <Card className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">{currentQuestion.question}</h3>
              <p className="text-sm text-muted-foreground mb-6">What would YOU rather?</p>
              
              <div className="space-y-4">
                <Button
                  className="w-full h-auto py-6 text-lg"
                  variant="outline"
                  onClick={() => handleMyAnswer('A')}
                >
                  <span className="mr-3 font-bold text-primary">A</span>
                  {currentQuestion.optionA}
                </Button>
                
                <Button
                  className="w-full h-auto py-6 text-lg"
                  variant="outline"
                  onClick={() => handleMyAnswer('B')}
                >
                  <span className="mr-3 font-bold text-primary">B</span>
                  {currentQuestion.optionB}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "play-guess") {
    const currentQuestion = gameQuestions[currentIndex];
    const progressPercent = ((currentIndex + 1) / gameQuestions.length) * 100;

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => {
            setCurrentAnswer(null);
            setGameMode("play-answer");
          }}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Question {currentIndex + 1} of {gameQuestions.length}
              </span>
              <span className="text-sm text-accent font-semibold">
                Step 2: Partner Prediction
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6">
            <Card className="p-8 text-center">
              <Badge className="mb-4" variant="secondary">You chose: {currentAnswer === 'A' ? 'A' : 'B'}</Badge>
              <h3 className="text-2xl font-bold mb-2">{currentQuestion.question}</h3>
              <p className="text-sm text-muted-foreground mb-6">What would YOUR PARTNER rather?</p>
              
              <div className="space-y-4">
                <Button
                  className="w-full h-auto py-6 text-lg"
                  variant="outline"
                  onClick={() => handleMyGuess('A')}
                >
                  <span className="mr-3 font-bold text-primary">A</span>
                  {currentQuestion.optionA}
                </Button>
                
                <Button
                  className="w-full h-auto py-6 text-lg"
                  variant="outline"
                  onClick={() => handleMyGuess('B')}
                >
                  <span className="mr-3 font-bold text-primary">B</span>
                  {currentQuestion.optionB}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "waiting") {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setGameMode("menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">Waiting for Partner</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <Clock className="w-20 h-20 mx-auto text-primary animate-pulse" />
            
            <div>
              <h3 className="text-2xl font-bold mb-2">Answers Submitted! ✓</h3>
              <p className="text-muted-foreground">
                Waiting for your partner to complete their Would You Rather...
              </p>
            </div>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground">
                We'll notify you when they're done and you can compare your answers together!
              </p>
            </Card>

            <Button className="w-full" variant="outline" onClick={() => setGameMode("menu")}>
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "compare") {
    const myCorrectGuesses = comparisonData.filter(c => c.didIGuessRight).length;
    const partnerCorrectGuesses = comparisonData.filter(c => c.didPartnerGuessRight).length;
    const matchingChoices = comparisonData.filter(c => c.myChoice === c.partnerChoice).length;
    
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setGameMode("menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">Results & Comparison</h2>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Score Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-3xl font-bold text-primary">{myCorrectGuesses}</div>
                  <p className="text-xs text-muted-foreground">Your Predictions</p>
                  <p className="text-xs font-medium mt-1">{Math.round((myCorrectGuesses/gameQuestions.length)*100)}% Accuracy</p>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-accent/10 to-secondary/10">
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto text-accent mb-2" />
                  <div className="text-3xl font-bold text-accent">{partnerCorrectGuesses}</div>
                  <p className="text-xs text-muted-foreground">Partner's Predictions</p>
                  <p className="text-xs font-medium mt-1">{Math.round((partnerCorrectGuesses/gameQuestions.length)*100)}% Accuracy</p>
                </div>
              </Card>
            </div>

            <Card className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-1">Matching Choices</h3>
                <div className="text-4xl font-bold text-primary mb-1">{matchingChoices}/{gameQuestions.length}</div>
                <p className="text-sm text-muted-foreground">You both chose the same {matchingChoices} times</p>
              </div>
            </Card>

            {/* Question by Question Breakdown */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Question Breakdown</h3>
              {comparisonData.map((item, idx) => (
                <Card key={idx} className="p-4">
                  <div className="mb-3">
                    <p className="font-medium mb-2">{item.question.question}</p>
                  </div>
                  
                  {/* Choices Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">You Chose:</p>
                      <div className={`p-2 rounded text-sm ${item.myChoice === 'A' ? 'bg-primary/20 border border-primary' : 'bg-muted'}`}>
                        <p className="font-medium">{item.myChoice}: {item.myChoice === 'A' ? item.question.optionA : item.question.optionB}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Partner Chose:</p>
                      <div className={`p-2 rounded text-sm ${item.partnerChoice === 'A' ? 'bg-accent/20 border border-accent' : 'bg-muted'}`}>
                        <p className="font-medium">{item.partnerChoice}: {item.partnerChoice === 'A' ? item.question.optionA : item.question.optionB}</p>
                      </div>
                    </div>
                  </div>

                  {/* Predictions */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      {item.didIGuessRight ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <p className="text-xs">
                        You guessed: <strong>{item.myGuess}</strong>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.didPartnerGuessRight ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <p className="text-xs">
                        Partner guessed: <strong>{item.partnerGuess}</strong>
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <Button className="w-full" onClick={startGame}>
                Play Again
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setGameMode("menu")}>
                Back to Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === "compare") {
    const myCorrectGuesses = comparisonData.filter(c => c.didIGuessRight).length;
    const partnerCorrectGuesses = comparisonData.filter(c => c.didPartnerGuessRight).length;
    const matchingChoices = comparisonData.filter(c => c.myChoice === c.partnerChoice).length;
    
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setGameMode("menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">Results & Comparison</h2>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Score Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto text-primary mb-2" />
                  <div className="text-3xl font-bold text-primary">{myCorrectGuesses}</div>
                  <p className="text-xs text-muted-foreground">Your Predictions</p>
                  <p className="text-xs font-medium mt-1">{Math.round((myCorrectGuesses/gameQuestions.length)*100)}% Accuracy</p>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-accent/10 to-secondary/10">
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto text-accent mb-2" />
                  <div className="text-3xl font-bold text-accent">{partnerCorrectGuesses}</div>
                  <p className="text-xs text-muted-foreground">Partner's Predictions</p>
                  <p className="text-xs font-medium mt-1">{Math.round((partnerCorrectGuesses/gameQuestions.length)*100)}% Accuracy</p>
                </div>
              </Card>
            </div>

            <Card className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-1">Matching Choices</h3>
                <div className="text-4xl font-bold text-primary mb-1">{matchingChoices}/{gameQuestions.length}</div>
                <p className="text-sm text-muted-foreground">You both chose the same {matchingChoices} times</p>
              </div>
            </Card>

            {/* Question by Question Comparison */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Question Breakdown</h3>
              {comparisonData.map((item, idx) => (
                <Card key={idx} className={`p-4 ${item.myChoice === item.partnerChoice ? 'border-green-500/50 bg-green-500/5' : 'border-muted'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {item.myChoice === item.partnerChoice ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{item.question.question}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className={`p-2 rounded ${item.myChoice === 'A' ? 'bg-primary/20 border border-primary' : 'bg-muted'}`}>
                          <p className="text-xs text-muted-foreground mb-1">A: {item.question.optionA}</p>
                          {item.myChoice === 'A' && <Badge variant="secondary" className="text-xs">You</Badge>}
                          {item.partnerChoice === 'A' && <Badge variant="outline" className="text-xs ml-1">Partner</Badge>}
                        </div>
                        <div className={`p-2 rounded ${item.myChoice === 'B' ? 'bg-primary/20 border border-primary' : 'bg-muted'}`}>
                          <p className="text-xs text-muted-foreground mb-1">B: {item.question.optionB}</p>
                          {item.myChoice === 'B' && <Badge variant="secondary" className="text-xs">You</Badge>}
                          {item.partnerChoice === 'B' && <Badge variant="outline" className="text-xs ml-1">Partner</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <Button className="w-full" onClick={startGame}>
                Play Again
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setGameMode("menu")}>
                Back to Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
