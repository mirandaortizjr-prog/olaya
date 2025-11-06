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
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'linear-gradient(180deg, hsl(270 50% 15%), hsl(0 0% 0%))' }}>
      <div className="flex justify-around items-center h-[72px] max-w-lg mx-auto" style={{ gap: '40px' }}>
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={`w-7 h-7 p-0 relative hover:bg-transparent ${
              activeView === item.id ? 'text-white' : 'text-gray-500'
            }`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="w-7 h-7" strokeWidth={1.5} />
            {item.hasNotification && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-black" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
