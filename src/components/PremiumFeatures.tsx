import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock, Flame, Heart, Clock, Sparkles } from 'lucide-react';
import { DesireVault } from './DesireVault';
import { DesireTimeline } from './DesireTimeline';
import { LoveLanguageSelector } from './LoveLanguageSelector';
import { CalmingTools } from './CalmingTools';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

interface PremiumFeaturesProps {
  coupleId: string;
  userId: string;
  userEmail: string;
  partnerUserId?: string;
  lastViewedTimestamp?: Date;
}

export const PremiumFeatures = ({ 
  coupleId, 
  userId, 
  userEmail, 
  partnerUserId,
  lastViewedTimestamp 
}: PremiumFeaturesProps) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const { isPremium, isLoading, createCheckoutSession } = useSubscription(userId);
  const { toast } = useToast();

  const features = [
    {
      id: 'desire-vault',
      name: 'Desire Vault',
      icon: Flame,
      description: 'Share intimate fantasies and desires',
      component: <DesireVault coupleId={coupleId} userId={userId} lastViewedTimestamp={lastViewedTimestamp} />
    },
    {
      id: 'desire-timeline',
      name: 'Desire Timeline',
      icon: Clock,
      description: 'Journey of fulfilled desires',
      component: <DesireTimeline coupleId={coupleId} userId={userId} />
    },
    {
      id: 'love-language',
      name: 'Love Languages',
      icon: Heart,
      description: 'Discover how you love',
      component: <LoveLanguageSelector userId={userId} partnerUserId={partnerUserId} />
    },
    {
      id: 'calming-tools',
      name: 'Calming Tools',
      icon: Sparkles,
      description: 'Breathing & relaxation exercises',
      component: <CalmingTools />
    },
  ];

  const handleFeatureClick = async (featureId: string) => {
    if (!isPremium) {
      try {
        await createCheckoutSession(userEmail);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to start checkout. Please try again.',
          variant: 'destructive',
        });
      }
      return;
    }
    setActiveFeature(featureId);
  };

  const renderFeatureContent = () => {
    const feature = features.find(f => f.id === activeFeature);
    return feature?.component;
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.id}
              className="relative cursor-pointer hover:shadow-glow transition-all bg-card/50 backdrop-blur border-border/50"
              onClick={() => handleFeatureClick(feature.id)}
            >
              {!isPremium && (
                <div className="absolute top-2 right-2">
                  <Lock className="h-3 w-3 text-primary" />
                </div>
              )}
              <CardContent className="p-4 text-center">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="font-semibold text-sm mb-1">{feature.name}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!isPremium && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="p-4 text-center">
            <Lock className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium mb-2">Premium Features</p>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock deeper intimacy and connection tools
            </p>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => createCheckoutSession(userEmail)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Upgrade to Premium'}
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!activeFeature} onOpenChange={() => setActiveFeature(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {features.find(f => f.id === activeFeature)?.name}
            </DialogTitle>
          </DialogHeader>
          {renderFeatureContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};
