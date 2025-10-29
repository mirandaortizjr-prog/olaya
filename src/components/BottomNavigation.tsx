import { Button } from "@/components/ui/button";
import { Calendar, Flame, Home, Lock, Image, Heart, Gamepad2 } from "lucide-react";

interface BottomNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  pendingGamesCount?: number;
  newDesiresCount?: number;
  newFlirtsCount?: number;
  newVaultCount?: number;
}

export const BottomNavigation = ({ 
  activeView, 
  onViewChange, 
  pendingGamesCount = 0,
  newDesiresCount = 0,
  newFlirtsCount = 0,
  newVaultCount = 0
}: BottomNavigationProps) => {
  const navItems = [
    { id: "desires", icon: Heart, label: "Desires", hasNotification: newDesiresCount > 0 },
    { id: "flirt", icon: Flame, label: "Flirt", hasNotification: newFlirtsCount > 0 },
    { id: "home", icon: Home, label: "Home" },
    { id: "locked", icon: Lock, label: "Vault", hasNotification: newVaultCount > 0 },
    { id: "games", icon: Gamepad2, label: "Games", hasNotification: pendingGamesCount > 0 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={`flex-col h-auto py-2 relative ${
              activeView === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
            {item.hasNotification && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
