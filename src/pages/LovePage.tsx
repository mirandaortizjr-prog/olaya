import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const LovePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white pb-20" style={{ background: 'linear-gradient(180deg, hsl(280 60% 15%), hsl(280 60% 8%), hsl(0 0% 0%))' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-purple-300 hover:text-purple-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">Love</h1>
          <div className="w-10" />
        </div>

        <div className="text-center text-purple-200 mt-20">
          <p>This page is ready for your new content</p>
        </div>
      </div>
    </div>
  );
};
