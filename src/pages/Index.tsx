import { Heart, MessageCircle, Calendar, Smile, Sparkles, BookHeart, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import olayaLogo from "@/assets/olaya-logo.png";
import shopIcon from "@/assets/shop-icon.png";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>();
  const [hasCoupleProfile, setHasCoupleProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isPremium } = useSubscription(userId);
  
  const features = [
    {
      icon: MessageCircle,
      title: "Daily Notes",
      description: "Morning whispers and evening blessings",
      gradient: "from-primary/20 to-accent/20",
    },
    {
      icon: Heart,
      title: "Love Notes",
      description: "Share your deepest affections",
      gradient: "from-accent/20 to-secondary/20",
    },
    {
      icon: Calendar,
      title: "Memory Calendar",
      description: "Cherish special moments together",
      gradient: "from-secondary/20 to-primary/20",
    },
    {
      icon: Smile,
      title: "Mood Check-in",
      description: "Express how you're feeling today",
      gradient: "from-primary/20 to-secondary/20",
    },
    {
      icon: Sparkles,
      title: "Gratitude Wall",
      description: "Celebrate what you appreciate",
      gradient: "from-accent/20 to-primary/20",
    },
    {
      icon: BookHeart,
      title: "Shared Journal",
      description: "Grow together through reflection",
      gradient: "from-secondary/20 to-accent/20",
    },
  ];

  const freeFeatures = [
    "Daily Notes: Morning whispers, evening blessings",
    "Love Notes: Share your deepest affections",
    "Memory Calendar: Cherish special moments together",
    "Mood Check-in: Express how you're feeling today",
    "Gratitude Wall: Celebrate what you appreciate",
    "Shared Journal: Grow together through reflection",
  ];

  const premiumFeatures = [
    "All Free Features included",
    "Unlimited storage for memories and media",
    "Advanced privacy controls",
    "Priority customer support",
    "Early access to new features",
  ];

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          // If user is authenticated, redirect to dashboard
          // Let the dashboard handle couple profile checks
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [navigate]);

  if (isLoading) {
    return null; // No loading screen, handled by App.tsx splash
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute top-4 left-4 z-10">
          <img 
            src={shopIcon} 
            alt="Shop" 
            className="w-12 h-12 cursor-pointer animate-pulse-glow"
          />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcher />
        </div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center space-y-6">
            <img 
              src={olayaLogo} 
              alt="OLAYA Logo" 
              className="w-80 h-80 mb-6 drop-shadow-2xl"
            />
            <p className="text-xl lg:text-2xl text-slate-300 max-w-lg">
              {t("indexSubtitle")}
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="shadow-glow" onClick={() => window.location.href = '/auth'}>
                {t("getStarted")}
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                {t("viewPricing")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Everything you need to deepen your bond
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughtfully designed features to nurture intimacy, communication, and shared joy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group p-8 hover:shadow-glow transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 bg-card/80 backdrop-blur"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20" id="pricing">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Choose your journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready to deepen your practice
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <Card className="p-8 border-2 hover:border-primary/30 transition-all bg-card/80 backdrop-blur">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                The Everyday Sanctuary
              </h3>
              <p className="text-muted-foreground mb-6">
                A gentle, accessible space for daily connection and emotional presence
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">Free</span>
                <span className="text-muted-foreground">forever</span>
              </div>
            </div>

            <Button size="lg" className="w-full mb-8" onClick={() => window.location.href = '/auth'}>
              Start Your Sanctuary
            </Button>

            <div className="space-y-4">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Premium Tier */}
          <Card className="p-8 border-2 border-primary/50 hover:border-primary transition-all bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur shadow-glow relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              POPULAR
            </div>
            
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                The Legacy Temple
              </h3>
              <p className="text-muted-foreground mb-6">
                A deeper, ritual-rich experience for emotional legacy and sacred intimacy
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <Button size="lg" variant="default" className="w-full mb-8 shadow-soft" onClick={() => window.location.href = '/auth'}>
              Unlock the Temple
            </Button>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground mb-4">Everything in Free, plus:</p>
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden p-12 text-center bg-gradient-romantic shadow-glow">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-primary-foreground mb-6">
              Begin your journey together
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Create your private sanctuary and start building deeper connections today
            </p>
            <Button size="lg" variant="secondary" className="shadow-soft" onClick={() => window.location.href = '/auth'}>
              Create Your Space
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for couples
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

