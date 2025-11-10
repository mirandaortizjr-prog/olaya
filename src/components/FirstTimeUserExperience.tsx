import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Check, Heart, Sparkles, ArrowDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FTUEStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right";
  action?: string;
}

const FTUE_STEPS: FTUEStep[] = [
  {
    id: "couple-name",
    title: "What do you call your love story?",
    description: "Give your shared space a name that feels like home.",
    targetSelector: "[data-ftue='couple-name']",
    position: "bottom",
    action: "Open settings and set your Nest Name"
  },
  {
    id: "shared-photo",
    title: "Choose a photo that feels like 'us'",
    description: "Upload a picture that captures your connection.",
    targetSelector: "[data-ftue='shared-photo']",
    position: "bottom",
    action: "Upload your couple photo"
  },
  {
    id: "anniversary",
    title: "When did your journey begin?",
    description: "Mark the day your hearts found each other.",
    targetSelector: "[data-ftue='anniversary']",
    position: "bottom",
    action: "Set your anniversary date"
  },
  {
    id: "couple-songs",
    title: "Add moments that play like memories",
    description: "Choose songs that soundtrack your love story.",
    targetSelector: "[data-ftue='songs']",
    position: "bottom",
    action: "Add your first song"
  },
  {
    id: "slideshow",
    title: "Build your memory lane",
    description: "Upload up to 5 photos that tell your story.",
    targetSelector: "[data-ftue='slideshow']",
    position: "bottom",
    action: "Upload slideshow photos"
  },
  {
    id: "page-title",
    title: "Name your sanctuary",
    description: "What should we call this beautiful space?",
    targetSelector: "[data-ftue='page-title']",
    position: "bottom",
    action: "Set your page title"
  },
  {
    id: "skin-gradient",
    title: "Make it yours",
    description: "Choose colors that feel like your relationship.",
    targetSelector: "[data-ftue='skin']",
    position: "bottom",
    action: "Choose your visual style"
  },
  {
    id: "theme",
    title: "Set the mood",
    description: "Personalize your colors, language, and brightness.",
    targetSelector: "[data-ftue='theme']",
    position: "bottom",
    action: "Customize theme preferences"
  },
  {
    id: "mood-status",
    title: "How are you feeling right now?",
    description: "Let your partner know what's in your heart.",
    targetSelector: "[data-ftue='mood']",
    position: "top",
    action: "Share your current mood"
  },
  {
    id: "desires",
    title: "What do you need most right now?",
    description: "Express what would make you feel loved today.",
    targetSelector: "[data-ftue='desires']",
    position: "top",
    action: "Select from desires menu"
  },
  {
    id: "first-flirt",
    title: "Send a little love",
    description: "Start with a flirt—playful, tender, just for them.",
    targetSelector: "[data-ftue='flirt']",
    position: "top",
    action: "Send your first flirt"
  },
  {
    id: "first-journal",
    title: "Begin your shared story",
    description: "Write your first entry together—memories start here.",
    targetSelector: "[data-ftue='journal']",
    position: "top",
    action: "Write your first journal entry"
  }
];

interface FirstTimeUserExperienceProps {
  userId: string;
  coupleId: string | null;
}

export const FirstTimeUserExperience = ({ userId, coupleId }: FirstTimeUserExperienceProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCompactView, setShowCompactView] = useState(false);
  const [showFullGuide, setShowFullGuide] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFTUEStatus();
  }, [userId]);

  const loadFTUEStatus = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("ftue_completed, ftue_progress")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error loading FTUE status:", error);
      return;
    }

    if (data?.ftue_completed) {
      setIsActive(false);
      setShowCompactView(false);
      setShowFullGuide(false);
    } else {
      setIsActive(true);
      const progress = data?.ftue_progress;
      if (Array.isArray(progress)) {
        const completedArr = progress as string[];
        setCompletedSteps(completedArr);
        // Find the first incomplete step
        const firstIncomplete = FTUE_STEPS.findIndex(step => !completedArr.includes(step.id));
        if (firstIncomplete !== -1) {
          setCurrentStep(firstIncomplete);
        }
      } else {
        setCompletedSteps([]);
      }
    }
  };

  const markStepComplete = async (stepId: string) => {
    const newCompleted = [...completedSteps, stepId];
    setCompletedSteps(newCompleted);

    await supabase
      .from("profiles")
      .update({ ftue_progress: newCompleted })
      .eq("id", userId);

    if (newCompleted.length === FTUE_STEPS.length) {
      completeFTUE();
    } else if (currentStep < FTUE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const completeFTUE = async () => {
    await supabase
      .from("profiles")
      .update({ ftue_completed: true })
      .eq("id", userId);

    setIsActive(false);
    
    toast({
      title: "✨ Your sanctuary is ready!",
      description: "You've personalized your shared space. Want to go deeper? Unlock your Private Vault and emotional games with Premium.",
      duration: 8000,
    });
  };

  const skipFTUE = async () => {
    await supabase
      .from("profiles")
      .update({ ftue_completed: true })
      .eq("id", userId);

    setIsActive(false);
    setShowCompactView(false);
    setShowFullGuide(false);
    
    toast({
      title: "Setup skipped",
      description: "You can always customize your space from settings.",
    });
  };

  const minimizeGuide = () => {
    setShowFullGuide(false);
    setShowCompactView(true);
  };

  const progress = (completedSteps.length / FTUE_STEPS.length) * 100;

  if (!isActive) return null;
  if (!coupleId) return null;

  const currentStepData = FTUE_STEPS[currentStep];

  return (
    <>
      {/* Compact Progress Indicator */}
      {showCompactView && (
        <Card 
          className="fixed bottom-20 right-4 z-50 p-3 bg-card/95 backdrop-blur-sm border-primary/20 shadow-lg cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {
            setShowCompactView(false);
            setShowFullGuide(true);
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-foreground">Setup Guide</p>
                <p className="text-xs text-muted-foreground">{completedSteps.length}/{FTUE_STEPS.length} complete</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Card>
      )}

      {/* Full Guide Modal */}
      {showFullGuide && currentStepData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={minimizeGuide}
          />
          
          {/* Guide Card */}
          <Card className="relative z-10 w-full max-w-md bg-card shadow-2xl border-primary/30 animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Setting Up Your Sanctuary</h2>
                  <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {FTUE_STEPS.length}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={minimizeGuide}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2 text-right">{Math.round(progress)}% complete</p>
            </div>

            {/* Current Step Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    {currentStepData.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {currentStepData.action && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <ArrowDown className="w-4 h-4 text-primary mt-0.5 animate-bounce" />
                    <p className="text-sm text-foreground">
                      <strong className="text-primary">Next:</strong> {currentStepData.action}
                    </p>
                  </div>
                </div>
              )}

              {/* Progress Checklist */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick View</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {FTUE_STEPS.slice(0, 6).map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = index === currentStep;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-2 text-xs p-1.5 rounded transition-colors ${
                          isCurrent ? 'bg-primary/10' : ''
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3 h-3 text-primary flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-current flex-shrink-0 opacity-30" />
                        )}
                        <span className={`${
                          isCompleted ? 'text-muted-foreground line-through' : 
                          isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-6 pt-0">
              <Button
                onClick={() => markStepComplete(currentStepData.id)}
                className="flex-1"
                size="lg"
              >
                {currentStep === FTUE_STEPS.length - 1 ? "Complete Setup ✨" : "Got it!"}
              </Button>
              <Button
                variant="ghost"
                onClick={skipFTUE}
                size="lg"
              >
                Skip
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
