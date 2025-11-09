import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoveLanguageSelector } from '@/components/LoveLanguageSelector';

interface LoveLanguageGameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

export const LoveLanguageGame = ({ userId, partnerId, onBack }: LoveLanguageGameProps) => {
  return (
    <div className="min-h-screen bg-background p-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games
      </Button>
      
      <LoveLanguageSelector userId={userId} partnerUserId={partnerId || undefined} />
    </div>
  );
};
