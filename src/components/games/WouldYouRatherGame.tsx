import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Trash2, Star, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getWouldYouRatherQuestions } from "@/lib/wouldYouRatherQuestions";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { Switch } from "@/components/ui/switch";

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

export const WouldYouRatherGame = ({ coupleId, userId, partnerId, onBack }: GameProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { progress } = useCoupleProgress(coupleId);
  
  const [gameMode, setGameMode] = useState<"menu" | "customize" | "play" | "results">("menu");
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState({ question: "", optionA: "", optionB: "" });
  const [includeSpicy, setIncludeSpicy] = useState(true);
  const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myAnswers, setMyAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [partnerAnswers, setPartnerAnswers] = useState<Record<string, 'A' | 'B'>>({});
  const [sessionId] = useState(() => `wyr-${Date.now()}`);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    loadCustomQuestions();
    loadPartnerAnswers();
  }, []);

  const loadCustomQuestions = async () => {
    const { data } = await supabase
      .from('custom_game_questions')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('game_type', 'would-you-rather')
      .order('created_at', { ascending: false });

    if (data) {
      setCustomQuestions(data.map(q => ({
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
      const answers: Record<string, 'A' | 'B'> = {};
      data.forEach(r => {
        answers[r.question_id] = r.answer as 'A' | 'B';
      });
      setPartnerAnswers(answers);
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

    setCustomQuestions([...customQuestions, {
      id: data.id,
      question: data.question,
      optionA: data.option_a || '',
      optionB: data.option_b || ''
    }]);
    setNewQuestion({ question: "", optionA: "", optionB: "" });
    toast({ title: "Custom question added!" });
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
    setMatchCount(0);
    setGameMode("play");
  };

  const handleAnswer = async (choice: 'A' | 'B') => {
    const currentQuestion = gameQuestions[currentIndex];
    
    // Save answer
    await supabase.from('game_responses').insert({
      couple_id: coupleId,
      user_id: userId,
      game_type: 'would-you-rather',
      question_id: currentQuestion.id,
      answer: choice,
      session_id: sessionId
    });

    const newAnswers = { ...myAnswers, [currentQuestion.id]: choice };
    setMyAnswers(newAnswers);

    // Check if partner answered this question
    if (partnerAnswers[currentQuestion.id]) {
      if (partnerAnswers[currentQuestion.id] === choice) {
        setMatchCount(matchCount + 1);
        toast({ title: "Match! 💕", description: "You both chose the same!", duration: 2000 });
      }
    }

    // Move to next question or results
    if (currentIndex < gameQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    } else {
      setTimeout(() => {
        calculateResults(newAnswers);
        setGameMode("results");
      }, 1500);
    }
  };

  const calculateResults = (answers: Record<string, 'A' | 'B'>) => {
    let matches = 0;
    Object.keys(answers).forEach(questionId => {
      if (partnerAnswers[questionId] === answers[questionId]) {
        matches++;
      }
    });
    setMatchCount(matches);
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
            <Card className="p-6">
              <h3 className="font-semibold mb-3">How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Choose between two options for 10 questions</li>
                <li>• See how many choices match your partner</li>
                <li>• Add custom questions or use our curated ones</li>
                <li>• Higher levels unlock spicier questions 🌶️</li>
              </ul>
            </Card>

            {customQuestions.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Your Custom Questions ({customQuestions.length})</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  These will be mixed with system questions
                </p>
              </Card>
            )}

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="spicy">Include Spicy Questions 🌶️</Label>
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
                Start Playing (10 Questions)
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setGameMode("customize")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Questions
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

  if (gameMode === "play") {
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
              <span className="text-sm text-muted-foreground">
                {matchCount} {matchCount === 1 ? 'match' : 'matches'}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6">
            <Card className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-8">{currentQuestion.question}</h3>
              
              <div className="space-y-4">
                <Button
                  className="w-full h-auto py-6 text-lg"
                  variant="outline"
                  onClick={() => handleAnswer('A')}
                >
                  <span className="mr-3 font-bold text-primary">A</span>
                  {currentQuestion.optionA}
                </Button>
                
                <Button
                  className="w-full h-auto py-6 text-lg"
                  variant="outline"
                  onClick={() => handleAnswer('B')}
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

  if (gameMode === "results") {
    const matchPercent = Math.round((matchCount / gameQuestions.length) * 100);
    
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setGameMode("menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">Results</h2>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <Trophy className="w-20 h-20 mx-auto text-yellow-500" />
            
            <div>
              <h3 className="text-4xl font-bold mb-2">{matchCount}/{gameQuestions.length}</h3>
              <p className="text-xl text-muted-foreground">Matching Choices</p>
            </div>

            <Card className="p-6">
              <div className="text-6xl font-bold text-primary mb-2">{matchPercent}%</div>
              <p className="text-muted-foreground">Compatibility</p>
            </Card>

            <div className="space-y-3">
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
