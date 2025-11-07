import { useEffect, useState } from "react";

export const SeasonalAnimations = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [leaves, setLeaves] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    setCurrentMonth(new Date().getMonth());
    
    // Generate random leaves for autumn (September=8, October=9, November=10)
    if (currentMonth >= 8 && currentMonth <= 10) {
      const newLeaves = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
      }));
      setLeaves(newLeaves);
    }
  }, [currentMonth]);

  // November = 10 (Thanksgiving month)
  const showTurkey = currentMonth === 10;
  // Autumn = September (8), October (9), November (10)
  const showLeaves = currentMonth >= 8 && currentMonth <= 10;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* Thanksgiving Turkey */}
      {showTurkey && (
        <div className="absolute bottom-24 w-full">
          <div className="animate-walk-turkey">
            <span className="text-4xl">🦃</span>
          </div>
        </div>
      )}

      {/* Autumn Falling Leaves */}
      {showLeaves && leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute -top-10 animate-fall-leaf"
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
          }}
        >
          <span className="text-2xl opacity-80">
            {['🍂', '🍁', '🍃'][Math.floor(Math.random() * 3)]}
          </span>
        </div>
      ))}
    </div>
  );
};
