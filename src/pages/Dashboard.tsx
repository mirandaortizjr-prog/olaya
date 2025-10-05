import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Heart, 
  LogOut, 
  MessageCircle, 
  Calendar, 
  Smile, 
  Sparkles, 
  BookHeart,
  Users,
  Star
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
    
    if (!session) {
      navigate("/auth");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-romantic animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loadingSanctuary")}</p>
        </div>
      </div>
    );
  }

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

  return (
    <>
      <header>
        <title>Dashboard - Your Sanctuary | UsTwo</title>
        <meta name="description" content="Your private couples sanctuary for daily connection, love notes, and shared moments" />
      </header>

      <div className="min-h-screen bg-gradient-warm">
        {/* Navigation Header */}
        <nav className="border-b border-border/50 bg-card/80 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
                {t("yourSanctuary")}
              </h1>
              <div className="flex gap-2 items-center">
                <LanguageSwitcher />
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("signOut")}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Card */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 shadow-glow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-romantic flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Welcome to Your Sanctuary
                </h2>
                <p className="text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="bg-card/50 rounded-lg p-6 border-2 border-dashed border-primary/20">
              <div className="flex items-start gap-4">
                <Star className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Your sanctuary is ready to grow
                  </h3>
                  <p className="text-muted-foreground">
                    Explore the features below to deepen your connection, share moments, and celebrate your journey together.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features Grid */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Your Sacred Tools
            </h2>
            
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
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <span className="text-sm text-primary font-medium">
                      Coming soon
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="mt-12">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent">
                <div className="text-4xl font-bold text-primary mb-2">0</div>
                <div className="text-muted-foreground">Love Notes Sent</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-transparent">
                <div className="text-4xl font-bold text-accent mb-2">0</div>
                <div className="text-muted-foreground">Memories Shared</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-secondary/5 to-transparent">
                <div className="text-4xl font-bold text-secondary mb-2">0</div>
                <div className="text-muted-foreground">Days Together</div>
              </Card>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-muted-foreground text-sm">
              <p className="flex items-center justify-center gap-2">
                Made with <Heart className="w-4 h-4 text-primary fill-primary" /> for couples
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
