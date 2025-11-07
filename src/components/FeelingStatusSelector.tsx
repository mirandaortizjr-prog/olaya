import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";


interface FeelingStatusSelectorProps {
  currentStatus?: string;
  currentCustomMessage?: string;
}

export const FeelingStatusSelector = ({ currentStatus, currentCustomMessage }: FeelingStatusSelectorProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/mood-customization")}
      className="gap-2"
    >
      <Smile className="w-4 h-4" />
      {currentCustomMessage || currentStatus || "Set mood"}
    </Button>
  );
};
