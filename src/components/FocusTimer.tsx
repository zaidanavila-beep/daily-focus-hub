import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const times = [5, 10, 15, 25];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      toast.success(`🎯 Focus session complete!`);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const setTimer = (minutes: number) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100;

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">Focus Timer</h3>
      </div>

      <div className="text-center mb-4">
        <div className="relative inline-block">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${progress * 2.76} 276`}
              className="text-primary transition-all"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {times.map((time) => (
          <button
            key={time}
            onClick={() => setTimer(time)}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              selectedTime === time
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            {time}m
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <Button size="sm" variant={isRunning ? 'secondary' : 'default'} onClick={toggleTimer}>
          {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button size="sm" variant="ghost" onClick={resetTimer}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
