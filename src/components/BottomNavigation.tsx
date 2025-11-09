import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Settings, Plus } from "lucide-react";

interface BottomNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onSettingsClick: () => void;
  pendingGamesCount?: number;
  newDesiresCount?: number;
  newFlirtsCount?: number;
  newVaultCount?: number;
}

export const BottomNavigation = ({ 
  activeView, 
  onViewChange,
  onSettingsClick,
  pendingGamesCount = 0,
  newDesiresCount = 0,
  newFlirtsCount = 0,
  newVaultCount = 0
}: BottomNavigationProps) => {
  const navItems = [
    { id: "new", icon: Plus, label: "New" },
    { id: "journal", icon: BookOpen, label: "Journal" },
    { id: "messages", icon: MessageCircle, label: "Messages" },
    { id: "settings", icon: Settings, label: "Settings", isAction: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'var(--nav-gradient)' }}>
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className="w-12 h-12 p-0 hover:bg-white/5"
            onClick={() => {
              if (item.isAction) {
                onSettingsClick();
              } else {
                onViewChange(item.id);
              }
            }}
          >
            <item.icon 
              className="w-9 h-9" 
              style={{ color: activeView === item.id ? 'hsl(200 30% 70%)' : 'hsl(200 20% 50%)' }}
              strokeWidth={1.5}
            />
          </Button>
        ))}
      </div>
    </div>
  );
};
