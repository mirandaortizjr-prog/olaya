import { useEffect, useState } from "react";
import splashImage from "@/assets/splash-image.png";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash for 1.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade-out animation to complete before calling onFinish
      setTimeout(onFinish, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <img
          src={splashImage}
          alt="OLAYA Together"
          className="w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl animate-scale-in"
        />
      </div>
    </div>
  );
};
