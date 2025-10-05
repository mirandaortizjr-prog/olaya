import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Wind, Waves, Music } from 'lucide-react';
import { useState } from 'react';

export const CalmingTools = () => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  const exercises = [
    {
      id: 'breathing',
      name: 'Breathing Exercise',
      icon: Wind,
      description: 'Take deep breaths: Inhale for 4 seconds, hold for 4, exhale for 4',
    },
    {
      id: 'meditation',
      name: 'Quick Meditation',
      icon: Sparkles,
      description: 'Close your eyes and focus on the present moment for 5 minutes',
    },
    {
      id: 'sounds',
      name: 'Calming Sounds',
      icon: Waves,
      description: 'Listen to soothing sounds like rain, ocean waves, or forest',
    },
    {
      id: 'music',
      name: 'Relaxing Music',
      icon: Music,
      description: 'Play gentle, instrumental music to help you relax',
    },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Calming Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exercises.map((exercise) => {
          const Icon = exercise.icon;
          return (
            <Card
              key={exercise.id}
              className={`cursor-pointer transition-all ${
                activeExercise === exercise.id ? 'bg-primary/10 border-primary' : ''
              }`}
              onClick={() => setActiveExercise(exercise.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">{exercise.name}</h4>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {activeExercise && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setActiveExercise(null)}
          >
            Close Exercise
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
