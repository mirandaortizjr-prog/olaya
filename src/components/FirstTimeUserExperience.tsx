import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Check, Heart, Sparkles, ArrowDown, ChevronRight, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FTUEStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: "top" | "bottom" | "left" | "right";
  action?: string;
  navigationPath?: string;
  scrollToSelector?: string;
}

const FTUE_STEPS: FTUEStep[] = [
  {
    id: "couple-name",
    title: "What do you call your love story?",
    description: "Give your shared space a name that feels like home.",
    targetSelector: "[data-ftue='couple-name']",
    position: "bottom",
    action: "Set your Nest Name",
    navigationPath: "/dashboard",
    scrollToSelector: "[data-ftue='couple-name']"
  },
  {
    id: "shared-photo",
    title: "Choose a photo that feels like 'us'",
    description: "Upload a picture that captures your connection.",
    targetSelector: "[data-ftue='shared-photo']",
    position: "bottom",
    action: "Upload your couple photo",
    navigationPath: "/dashboard",
    scrollToSelector: "[data-ftue='shared-photo']"
  },
  {
    id: "anniversary",
    title: "When did your journey begin?",
    description: "Mark the day your hearts found each other.",
    targetSelector: "[data-ftue='anniversary']",
    position: "bottom",
    action: "Set your anniversary date",
    navigationPath: "/dashboard",
    scrollToSelector: "[data-ftue='anniversary']"
  },
  {
    id: "couple-songs",
    title: "Add moments that play like memories",
    description: "Choose songs that soundtrack your love story.",
    targetSelector: "[data-ftue='songs']",
    position: "bottom",
    action: "Add your first song",
    navigationPath: "/dashboard",
    scrollToSelector: "[data-ftue='songs']"
  },
  {
    id: "slideshow",
    title: "Build your memory lane",
    description: "Upload up to 5 photos that tell your story.",
    targetSelector: "[data-ftue='slideshow']",
    position: "bottom",
    action: "Upload slideshow photos",
    navigationPath: "/dashboard",
    scrollToSelector: "[data-ftue='slideshow']"
  },
  {
    id: "page-title",
    title: "Name your sanctuary",
    description: "What should we call this beautiful space?",
    targetSelector: "[data-ftue='page-title']",
    position: "bottom",
    action: "Set your page title",
    navigationPath: "/dashboard",
    scrollToSelector: "[data-ftue='page-title']"
  },
  {
    id: "skin-gradient",
    title: "Make it yours",
    description: "Choose colors that feel like your relationship.",
    targetSelector: "[data-ftue='skin']",
    position: "bottom",
    action: "Choose your visual style",
    navigationPath: "/shop"
  },
  {
    id: "theme",
    title: "Set the mood",
    description: "Personalize your colors, language, and brightness.",
    targetSelector: "[data-ftue='theme']",
    position: "bottom",
    action: "Customize theme preferences",
    navigationPath: "/dashboard",
    scrollToSelector: "[data-ftue='theme']"
  },
  {
    id: "mood-status",
    title: "How are you feeling right now?",
    description: "Let your partner know what's in your heart.",
    targetSelector: "[data-ftue='mood']",
    position: "top",
    action: "Share your current mood",
    navigationPath: "/mood-customization"
  },
  {
    id: "desires",
    title: "What do you need most right now?",
    description: "Express what would make you feel loved today.",
    targetSelector: "[data-ftue='desires']",
    position: "top",
    action: "Select from desires menu",
    navigationPath: "/desires"
  },
  {
    id: "first-flirt",
    title: "Send a little love",
    description: "Start with a flirt—playful, tender, just for them.",
    targetSelector: "[data-ftue='flirt']",
    position: "top",
    action: "Send your first flirt",
    navigationPath: "/flirts"
  },
  {
    id: "first-journal",
    title: "Begin your shared story",
    description: "Write your first entry together—memories start here.",
    targetSelector: "[data-ftue='journal']",
    position: "top",
    action: "Write your first journal entry",
    navigationPath: "/dashboard",
    scrollToSelector: "[data-ftue='journal']"
  }
];

interface FirstTimeUserExperienceProps {
  userId: string;
  coupleId: string | null;
  forceShow?: boolean;
}

export const FirstTimeUserExperience = ({ userId, coupleId, forceShow = false }: FirstTimeUserExperienceProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCompactView, setShowCompactView] = useState(false);
  const [showFullGuide, setShowFullGuide] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadFTUEStatus();
  }, [userId, forceShow]);

  const loadFTUEStatus = async () => {
    // Creator mode: Always show FTUE
    if (forceShow) {
      setIsActive(true);
      setShowCompactView(false);
      setShowFullGuide(true);
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

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

    // Don't save progress in creator mode
    if (!forceShow) {
      await supabase
        .from("profiles")
        .update({ ftue_progress: newCompleted })
        .eq("id", userId);
    }

    if (newCompleted.length === FTUE_STEPS.length) {
      completeFTUE();
    } else if (currentStep < FTUE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const completeFTUE = async () => {
    // Don't save completion in creator mode
    if (!forceShow) {
      await supabase
        .from("profiles")
        .update({ ftue_completed: true })
        .eq("id", userId);
    }

    setIsActive(false);
    
    toast({
      title: "✨ Your sanctuary is ready!",
      description: "You've personalized your shared space. Want to go deeper? Unlock your Private Vault and emotional games with Premium.",
      duration: 8000,
    });
  };

  const skipFTUE = async () => {
    // Don't save skip in creator mode
    if (!forceShow) {
      await supabase
        .from("profiles")
        .update({ ftue_completed: true })
        .eq("id", userId);
    }

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

  const handleActionClick = (step: FTUEStep) => {
    // Minimize the guide first
    minimizeGuide();
    
    // Navigate to the specified path if needed
    if (step.navigationPath) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        navigate(step.navigationPath!);
        
        // If there's a scroll target, scroll to it after navigation
        if (step.scrollToSelector) {
          setTimeout(() => {
            const element = document.querySelector(step.scrollToSelector!);
            if (element) {
              element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
              });
            }
          }, 500);
        }
      }, 100);
    }
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop - only minimize on direct backdrop click, not child clicks */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              // Only minimize if clicking directly on backdrop
              if (e.target === e.currentTarget) {
                minimizeGuide();
              }
            }}
          />
          
          {/* Guide Card */}
          <Card className="relative z-10 w-full max-w-md bg-card shadow-2xl border-primary/30 animate-in fade-in-0 zoom-in-95 duration-300 pointer-events-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50 sticky top-0 bg-card z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
                className="h-8 w-8 flex-shrink-0"
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
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                  <h3 className="text-xl font-bold text-foreground">
                    {currentStepData.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {currentStepData.action && (
                <Button
                  variant="outline"
                  className="w-full justify-between border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all"
                  onClick={() => handleActionClick(currentStepData)}
                >
                  <div className="flex items-center gap-2">
                    <ArrowDown className="w-4 h-4 text-primary animate-bounce" />
                    <span className="text-sm font-medium">
                      {currentStepData.action}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-primary" />
                </Button>
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
            <div className="flex gap-2 p-6 pt-0 sticky bottom-0 bg-card">
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
