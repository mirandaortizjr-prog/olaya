import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Heart, MessageCircle, Sparkles, Calendar, TrendingUp, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { HowWellGame } from "./games/HowWellGame";
import { MemoryLaneGame } from "./games/MemoryLaneGame";
import { LoveLanguageGame } from "./games/LoveLanguageGame";
import { WouldYouRatherGame } from "./games/WouldYouRatherGame";
import { DailySyncGame } from "./games/DailySyncGame";
import { FutureForecastGame } from "./games/FutureForecastGame";
import { TruthOrTenderGame } from "./games/TruthOrTenderGame";

interface CoupleGamesProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onClose: () => void;
}


export const CoupleGames = ({ coupleId, userId, partnerId, onClose }: CoupleGamesProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];

  const gamesList = [
    {
      id: "how-well",
      name: t.howWellDoYouKnowMe,
      description: t.howWellDesc,
      icon: Heart,
      color: "text-pink-500"
    },
    {
      id: "memory-lane",
      name: t.memoryLaneMatch,
      description: t.memoryLaneDesc,
      icon: MessageCircle,
      color: "text-purple-500"
    },
    {
      id: "love-language",
      name: t.loveLanguageDecoder,
      description: t.loveLanguageDesc,
      icon: Sparkles,
      color: "text-yellow-500"
    },
    {
      id: "would-you-rather",
      name: t.wouldYouRather,
      description: t.wouldYouRatherDesc,
      icon: Zap,
      color: "text-blue-500"
    },
    {
      id: "daily-sync",
      name: t.dailySync,
      description: t.dailySyncDesc,
      icon: Calendar,
      color: "text-green-500"
    },
    {
      id: "future-forecast",
      name: t.futureForecast,
      description: t.futureForecastDesc,
      icon: TrendingUp,
      color: "text-indigo-500"
    },
    {
      id: "truth-or-tender",
      name: t.truthOrTender,
      description: t.truthOrTenderDesc,
      icon: Heart,
      color: "text-red-500"
    }
  ];

  if (selectedGame === "how-well") {
    return <HowWellGame coupleId={coupleId} userId={userId} partnerId={partnerId} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "memory-lane") {
    return <MemoryLaneGame coupleId={coupleId} userId={userId} partnerId={partnerId} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "love-language") {
    return <LoveLanguageGame coupleId={coupleId} userId={userId} partnerId={partnerId} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "would-you-rather") {
    return <WouldYouRatherGame coupleId={coupleId} userId={userId} partnerId={partnerId} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "daily-sync") {
    return <DailySyncGame coupleId={coupleId} userId={userId} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "future-forecast") {
    return <FutureForecastGame coupleId={coupleId} userId={userId} partnerId={partnerId} onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "truth-or-tender") {
    return <TruthOrTenderGame coupleId={coupleId} userId={userId} onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">{t.coupleGames}</h2>
        </div>
        <Button variant="ghost" onClick={onClose}>{t.close}</Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-2">{t.getToKnowBetter}</h3>
            <p className="text-muted-foreground">{t.chooseGameToPlay}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {gamesList.map((game) => {
              const Icon = game.icon;
              return (
                <Card
                  key={game.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedGame(game.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-muted ${game.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{game.name}</h4>
                      <p className="text-sm text-muted-foreground">{game.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {!partnerId && (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t.invitePartner}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
