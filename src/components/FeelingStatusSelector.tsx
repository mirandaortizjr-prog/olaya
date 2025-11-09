import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getGenderedMood } from "@/lib/translations";
import { useUserGender } from "@/hooks/useUserGender";


interface FeelingStatusSelectorProps {
  currentStatus?: string;
  currentCustomMessage?: string;
  userId?: string;
}

export const FeelingStatusSelector = ({ currentStatus, currentCustomMessage, userId }: FeelingStatusSelectorProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { gender } = useUserGender(userId || null);

  // Get gendered version of the mood if it's a predefined mood key
  const displayMood = currentCustomMessage || 
    (currentStatus && currentStatus.startsWith('mood_') 
      ? getGenderedMood(currentStatus, gender, language) 
      : currentStatus) || 
    "Set mood";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/mood-customization")}
      className="gap-2"
    >
      <Smile className="w-4 h-4" />
      {displayMood}
    </Button>
  );
};
