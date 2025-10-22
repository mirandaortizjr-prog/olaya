import { Button } from "@/components/ui/button";
import { Calendar, Flame, Home, Lock, Image } from "lucide-react";

interface BottomNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const BottomNavigation = ({ activeView, onViewChange }: BottomNavigationProps) => {
  const navItems = [
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "flirt", icon: Flame, label: "Flirt" },
    { id: "home", icon: Home, label: "Home" },
    { id: "locked", icon: Lock, label: "Vault" },
    { id: "photos", icon: Image, label: "Private" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={`flex-col h-auto py-2 ${
              activeView === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
