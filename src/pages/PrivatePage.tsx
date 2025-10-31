import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tenderDaresImage from "@/assets/tender-dares.png";

interface PrivatePageProps {
  coupleId?: string;
  userId?: string;
}

const PrivatePage = ({ coupleId, userId }: PrivatePageProps) => {
  const navigate = useNavigate();

  const privateItems = [
    { 
      id: 'photos', 
      label: 'Photos',
      image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=200&h=200&fit=crop'
    },
    { 
      id: 'tender-dares', 
      label: 'Tender Dares',
      image: tenderDaresImage
    },
    { 
      id: 'videos', 
      label: 'Videos',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=200&fit=crop'
    },
    { 
      id: 'sex-timeline', 
      label: 'Sex Timeline',
      image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=200&h=200&fit=crop'
    },
    { 
      id: 'our-journal', 
      label: 'Our Journal',
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=200&h=200&fit=crop'
    },
    { 
      id: 'sex-lust-languages', 
      label: 'Sex & Lust Languages',
      image: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=200&h=200&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative h-24 bg-gradient-to-r from-red-900 to-red-800 flex items-center justify-center border-b-8 border-black">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, transparent 0%, transparent 20%, rgba(139, 0, 0, 0.3) 21%, transparent 22%), radial-gradient(circle at 60% 30%, transparent 0%, transparent 15%, rgba(139, 0, 0, 0.3) 16%, transparent 17%), radial-gradient(circle at 80% 70%, transparent 0%, transparent 18%, rgba(139, 0, 0, 0.3) 19%, transparent 20%), linear-gradient(135deg, transparent 48%, rgba(0,0,0,0.4) 49%, rgba(0,0,0,0.4) 51%, transparent 52%), linear-gradient(-135deg, transparent 48%, rgba(0,0,0,0.4) 49%, rgba(0,0,0,0.4) 51%, transparent 52%)',
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 15px 15px, 15px 15px'
          }}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-4 text-white hover:bg-white/20"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-4xl font-bold text-red-600 relative z-10 tracking-wider drop-shadow-lg">
          Private
        </h1>
      </div>

      {/* Main Content with red border frame */}
      <div className="p-2 bg-gradient-to-b from-red-900 to-red-800">
        <div className="bg-black p-6 pb-24 space-y-4 min-h-[calc(100vh-10rem)] border-4 border-red-900/50">
          {/* Notification Cards */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-3xl">
            <h3 className="text-lg font-semibold text-center text-foreground">
              Desires Notifications
            </h3>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-3xl">
            <h3 className="text-lg font-semibold text-center text-foreground">
              Flirts Notification
            </h3>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-3xl">
            <h3 className="text-lg font-semibold text-center text-foreground mb-4">
              Lust - O - Meter
            </h3>
            <Progress value={75} className="h-3 bg-red-200" />
          </Card>

          {/* Grid of Private Items */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            {privateItems.map((item) => (
              <button
                key={item.id}
                className="flex flex-col items-center gap-2 group"
                onClick={() => {
                  // Placeholder for future functionality
                  console.log(`Opening ${item.id}`);
                }}
              >
                <div className="relative">
                  <div 
                    className="w-24 h-24 rounded-full border-4 border-red-600 overflow-hidden bg-cover bg-center transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-amber-50 dark:bg-amber-950 rounded-full border-2 border-red-600 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-foreground" />
                  </div>
                </div>
                <span className="text-sm font-medium text-center text-white leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-900 to-red-800 border-t-8 border-black z-40">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"/>
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivatePage;
