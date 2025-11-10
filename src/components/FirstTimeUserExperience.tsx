import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Check, ArrowRight, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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
  const [showProgress, setShowProgress] = useState(true);
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
      setShowProgress(false);
    } else {
      setIsActive(true);
      const progress = data?.ftue_progress;
      if (Array.isArray(progress)) {
        setCompletedSteps(progress as string[]);
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
    setShowProgress(false);
    
    toast({
      title: "Setup skipped",
      description: "You can always customize your space from settings.",
    });
  };

  const progress = (completedSteps.length / FTUE_STEPS.length) * 100;

  if (!isActive && !showProgress) return null;
  if (!coupleId) return null;

  const currentStepData = FTUE_STEPS[currentStep];

  return (
    <>
      {/* Progress Tracker */}
      {showProgress && (
        <Card className="fixed top-4 right-4 z-50 p-4 w-80 bg-card/95 backdrop-blur-sm border-primary/20 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Setting Up Your Sanctuary</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowProgress(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{completedSteps.length} of {FTUE_STEPS.length} complete</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
            {FTUE_STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = index === currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-2 text-sm p-2 rounded-md transition-all ${
                    isCurrent ? 'bg-primary/10 border border-primary/20' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 mt-0.5 ${
                    isCompleted ? 'text-primary' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                  </div>
                  <span className={`flex-1 ${
                    isCompleted ? 'text-muted-foreground line-through' : 
                    isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {isActive && (
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => markStepComplete(currentStepData.id)}
              >
                Mark Current Step Complete
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={skipFTUE}
              >
                Skip Setup
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Current Step Tooltip */}
      {isActive && currentStepData && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm pointer-events-auto" />
          
          <Card className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-6 max-w-md bg-card shadow-2xl border-primary/30 pointer-events-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Step {currentStep + 1} of {FTUE_STEPS.length}
                </h2>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-muted-foreground mb-4">
              {currentStepData.description}
            </p>

            {currentStepData.action && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-foreground">
                  <strong>Action:</strong> {currentStepData.action}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => markStepComplete(currentStepData.id)}
                className="flex-1"
              >
                {currentStep === FTUE_STEPS.length - 1 ? "Complete Setup" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={skipFTUE}
              >
                Skip All
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
