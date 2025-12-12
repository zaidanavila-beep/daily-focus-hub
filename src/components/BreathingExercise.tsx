import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: { phase: Phase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4, label: 'Breathe In' },
  { phase: 'hold', duration: 4, label: 'Hold' },
  { phase: 'exhale', duration: 4, label: 'Breathe Out' },
  { phase: 'rest', duration: 2, label: 'Rest' },
];

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhase = PHASES[currentPhaseIndex];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            const nextIndex = (currentPhaseIndex + 1) % PHASES.length;
            setCurrentPhaseIndex(nextIndex);
            if (nextIndex === 0) setCycles(c => c + 1);
            return PHASES[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, currentPhaseIndex]);

  const toggleExercise = () => {
    if (!isActive) {
      setCurrentPhaseIndex(0);
      setCountdown(PHASES[0].duration);
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setCountdown(PHASES[0].duration);
    setCycles(0);
  };

  const getCircleSize = () => {
    if (currentPhase.phase === 'inhale') return 'scale-110';
    if (currentPhase.phase === 'exhale') return 'scale-90';
    return 'scale-100';
  };

  const getGradient = () => {
    switch (currentPhase.phase) {
      case 'inhale': return 'from-blue-400 to-cyan-500';
      case 'hold': return 'from-purple-400 to-pink-500';
      case 'exhale': return 'from-green-400 to-emerald-500';
      case 'rest': return 'from-gray-400 to-slate-500';
    }
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Breathing</h3>
        </div>
        <span className="text-xs text-muted-foreground">{cycles} cycles</span>
      </div>

      <div className="flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center transition-all duration-1000 ${getCircleSize()}`}
        >
          <span className="text-2xl font-bold text-white">{countdown}</span>
        </div>
        <p className="mt-3 text-sm font-medium">{currentPhase.label}</p>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={toggleExercise}>
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
