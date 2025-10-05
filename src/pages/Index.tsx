import { Heart, MessageCircle, Calendar, Smile, Sparkles, BookHeart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
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
    <div className="min-h-screen bg-gradient-warm">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-romantic opacity-30" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
                UsTwo
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-lg">
                Your sacred space for connection, intimacy, and love
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <Button size="lg" className="shadow-glow">
                  Get Started
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img
                src={heroImage}
                alt="Romantic couple connection"
                className="rounded-3xl shadow-glow w-full max-w-2xl mx-auto"
              />
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

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden p-12 text-center bg-gradient-romantic shadow-glow">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Begin your journey together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Create your private sanctuary and start building deeper connections today
            </p>
            <Button size="lg" variant="secondary" className="shadow-soft">
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
