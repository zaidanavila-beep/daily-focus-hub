import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause } from 'lucide-react';
type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';
const PHASES: {
  phase: Phase;
  duration: number;
  label: string;
}[] = [{
  phase: 'inhale',
  duration: 4,
  label: 'Breathe In'
}, {
  phase: 'hold',
  duration: 4,
  label: 'Hold'
}, {
  phase: 'exhale',
  duration: 4,
  label: 'Breathe Out'
}, {
  phase: 'rest',
  duration: 2,
  label: 'Rest'
}];
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
            // Move to next phase
            const nextIndex = (currentPhaseIndex + 1) % PHASES.length;
            setCurrentPhaseIndex(nextIndex);

            // Count cycles
            if (nextIndex === 0) {
              setCycles(c => c + 1);
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
      case 'inhale':
        return 'from-blue-400 to-cyan-500';
      case 'hold':
        return 'from-purple-400 to-pink-500';
      case 'exhale':
        return 'from-green-400 to-emerald-500';
      case 'rest':
        return 'from-gray-400 to-slate-500';
    }
  };
  return;
};