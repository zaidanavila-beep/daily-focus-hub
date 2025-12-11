import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause } from 'lucide-react';

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
        setCountdown((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const nextIndex = (currentPhaseIndex + 1) % PHASES.length;
            setCurrentPhaseIndex(nextIndex);
            
            // Count cycles
            if (nextIndex === 0) {
              setCycles((c) => c + 1);
            }
            
            return PHASES[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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
    <Card className="p-4 transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Wind className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-sm">Breathe</span>
        </div>
        {cycles > 0 && (
          <span className="text-xs text-muted-foreground">{cycles} cycles</span>
        )}
      </div>

      <div className="flex flex-col items-center">
        {/* Breathing circle */}
        <div
          className={`w-24 h-24 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center transition-all duration-1000 ease-in-out ${getCircleSize()} ${
            isActive ? 'shadow-lg' : ''
          }`}
        >
          <div className="text-center text-white">
            <p className="text-2xl font-bold">{countdown}</p>
            <p className="text-[10px] uppercase tracking-wider">{currentPhase.label}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={toggleExercise}
            className="gap-2"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          {(isActive || cycles > 0) && (
            <Button size="sm" variant="outline" onClick={reset}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center mt-3">
        4-4-4-2 breathing pattern for focus & calm
      </p>
    </Card>
  );
};
