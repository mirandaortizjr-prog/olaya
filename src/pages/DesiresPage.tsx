import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DesiresPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #000000 0%, #798791 50%, #000000 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/30 border-b border-white/10">
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Desires</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-lg mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Heart className="w-16 h-16 text-white/50" />
          <h2 className="text-2xl font-semibold text-white text-center">Desires Page</h2>
          <p className="text-white/70 text-center">Ready to build your desires feature here</p>
        </div>
      </div>
    </div>
  );
};
