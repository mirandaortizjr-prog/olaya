import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface GameProps {
  coupleId: string;
  userId: string;
  onBack: () => void;
}

export const TruthOrTenderGame = ({ onBack }: GameProps) => {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">Truth or Tender</h2>
      </div>
      <div className="flex-1 p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-muted-foreground">Coming soon!</p>
        </Card>
      </div>
    </div>
  );
};
