import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  Image,
  Calendar,
  Gift,
  Music,
  Flame,
  MessageCircle,
  Lock,
  Gamepad2,
  Mail,
  Settings,
  Palette,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  animation: string;
  route?: string;
  action?: () => void;
  demoContent?: React.ReactNode;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "splash",
    title: "Welcome to Olaya Together",
    description: "Customize your couple's space with your name, logo, and theme",
    icon: Heart,
    animation: "animate-fade-in",
  },
  {
    id: "pictures",
    title: "Picture Slideshow & Profiles",
    description: "Upload photos and set profile pictures for a personal touch",
    icon: Image,
    animation: "animate-scale-in",
    route: "/couple-profiles",
  },
  {
    id: "mood",
    title: "Mood & Anniversary",
    description: "Share how you're feeling and countdown to special dates",
    icon: Calendar,
    animation: "animate-bounce",
  },
  {
    id: "gifts",
    title: "Gift Box",
    description: "Send virtual gifts to show your love",
    icon: Gift,
    animation: "animate-pulse",
    route: "/gifts",
  },
  {
    id: "music",
    title: "Music Player",
    description: "Add your couple's songs and play them together",
    icon: Music,
    animation: "animate-fade-in",
  },
  {
    id: "flirts",
    title: "Flirts & Desires",
    description: "Send flirty messages and share your desires",
    icon: Flame,
    animation: "animate-scale-in",
    route: "/flirts",
  },
  {
    id: "feed",
    title: "Feed",
    description: "Share moments and memories on your timeline",
    icon: MessageCircle,
    animation: "animate-slide-in-right",
  },
  {
    id: "vault",
    title: "Private Vault",
    description: "Keep your intimate content secure and private",
    icon: Lock,
    animation: "animate-scale-in",
    route: "/private",
  },
  {
    id: "games",
    title: "Games",
    description: "Play fun couple games and earn rewards",
    icon: Gamepad2,
    animation: "animate-bounce",
  },
  {
    id: "messages",
    title: "Messages & Journal",
    description: "Chat and keep a shared journal of your journey",
    icon: Mail,
    animation: "animate-fade-in",
    route: "/messenger",
  },
  {
    id: "settings",
    title: "Settings",
    description: "Customize privacy, notifications, and preferences",
    icon: Settings,
    animation: "animate-scale-in",
  },
  {
    id: "themes",
    title: "Fonts & Skins",
    description: "Change the look and feel of your space instantly",
    icon: Palette,
    animation: "animate-fade-in",
  },
];

interface OnboardingWalkthroughProps {
  userId: string;
  coupleId: string;
  onComplete?: () => void;
  creatorMode?: boolean;
  triggerReplay?: boolean;
}

export const OnboardingWalkthrough = ({
  userId,
  coupleId,
  onComplete,
  creatorMode = false,
  triggerReplay = false,
}: OnboardingWalkthroughProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (creatorMode) {
      // In creator mode, always show the walkthrough
      setIsOpen(true);
    } else {
      checkWalkthroughStatus();
    }
  }, [userId, creatorMode]);

  useEffect(() => {
    if (triggerReplay) {
      setCurrentStep(0);
      setCompletedSteps([]);
      setIsOpen(true);
    }
  }, [triggerReplay]);

  const checkWalkthroughStatus = async () => {
    if (!userId) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("ftue_progress")
      .eq("id", userId)
      .single();

    const progress = profile?.ftue_progress as any;
    const walkthroughCompleted = progress?.walkthrough_completed;

    if (!walkthroughCompleted) {
      setIsOpen(true);
    }
  };

  const handleNext = () => {
    const step = ONBOARDING_STEPS[currentStep];
    
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeWalkthrough();
    }
  };

  const handleSkip = () => {
    completeWalkthrough();
  };

  const completeWalkthrough = async () => {
    // Only save to database if not in creator mode
    if (!creatorMode) {
      await supabase
        .from("profiles")
        .update({
          ftue_progress: {
            walkthrough_completed: true,
            completed_steps: completedSteps,
          },
        })
        .eq("id", userId);
    }

    toast({
      title: creatorMode ? "Preview Complete!" : "Walkthrough Complete! 🎉",
      description: creatorMode 
        ? "Creator preview mode - progress not saved" 
        : "You're all set to enjoy Olaya Together",
    });

    setIsOpen(false);
    onComplete?.();
  };

  const handleStepAction = () => {
    const step = ONBOARDING_STEPS[currentStep];
    
    if (step.route) {
      setIsOpen(false);
      navigate(step.route);
      setTimeout(() => setIsOpen(true), 500);
    }
    
    if (step.action) {
      step.action();
    }
  };

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const step = ONBOARDING_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 ${step.animation}`}>
              <StepIcon className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
            <p className="text-muted-foreground mb-4">{step.description}</p>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </Badge>
              {completedSteps.includes(step.id) && (
                <Badge variant="default" className="bg-green-500">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>

            <Progress value={progress} className="mb-6" />
          </div>

          {/* Demo Content Area */}
          <div className="bg-secondary/30 rounded-lg p-6 mb-6 min-h-[200px] flex items-center justify-center">
            {step.id === "splash" && (
              <div className="text-center animate-fade-in">
                <div className="text-6xl mb-4">💕</div>
                <p className="text-lg font-semibold">Customize your couple name & theme</p>
              </div>
            )}
            
            {step.id === "pictures" && (
              <div className="text-center animate-scale-in">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-lg font-semibold">Upload photos for your slideshow</p>
              </div>
            )}
            
            {step.id === "mood" && (
              <div className="text-center animate-bounce">
                <div className="text-6xl mb-4">😊</div>
                <p className="text-lg font-semibold">Share your current mood</p>
              </div>
            )}
            
            {step.id === "gifts" && (
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">🎁</div>
                <p className="text-lg font-semibold">Send virtual gifts with sparkles!</p>
              </div>
            )}
            
            {step.id === "music" && (
              <div className="text-center animate-fade-in">
                <div className="text-6xl mb-4">🎵</div>
                <p className="text-lg font-semibold">Add your couple's playlist</p>
              </div>
            )}
            
            {step.id === "flirts" && (
              <div className="text-center animate-scale-in">
                <div className="text-6xl mb-4">🔥</div>
                <p className="text-lg font-semibold">Send flirts & share desires</p>
              </div>
            )}
            
            {step.id === "feed" && (
              <div className="text-center animate-slide-in-right">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-lg font-semibold">Post moments to your timeline</p>
              </div>
            )}
            
            {step.id === "vault" && (
              <div className="text-center animate-scale-in">
                <div className="text-6xl mb-4">🔒</div>
                <p className="text-lg font-semibold">Secure private vault for intimate content</p>
              </div>
            )}
            
            {step.id === "games" && (
              <div className="text-center animate-bounce">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-lg font-semibold">Play games & unlock badges</p>
              </div>
            )}
            
            {step.id === "messages" && (
              <div className="text-center animate-fade-in">
                <div className="text-6xl mb-4">✉️</div>
                <p className="text-lg font-semibold">Chat & keep a shared journal</p>
              </div>
            )}
            
            {step.id === "settings" && (
              <div className="text-center animate-scale-in">
                <div className="text-6xl mb-4">⚙️</div>
                <p className="text-lg font-semibold">Customize privacy & preferences</p>
              </div>
            )}
            
            {step.id === "themes" && (
              <div className="text-center animate-fade-in">
                <div className="text-6xl mb-4">🎨</div>
                <p className="text-lg font-semibold">Change fonts & skins instantly</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleSkip}
            >
              Skip Tour
            </Button>
            
            {step.route && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleStepAction}
              >
                Try It Now
              </Button>
            )}
            
            <Button
              className="flex-1"
              onClick={handleNext}
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                "Finish"
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {ONBOARDING_STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep
                    ? "bg-primary w-8"
                    : completedSteps.includes(s.id)
                    ? "bg-green-500"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
