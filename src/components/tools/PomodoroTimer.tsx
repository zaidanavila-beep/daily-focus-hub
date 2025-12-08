import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'work' | 'break';

export const PomodoroTimer = () => {
  const [mode, setMode] = useState<Mode>('work');
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workTime = 25 * 60;
  const breakTime = 5 * 60;

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      // Timer finished
      if (mode === 'work') {
        setSessions((prev) => prev + 1);
        setMode('break');
        setTime(breakTime);
        new Notification('Break time!', { body: 'Great work! Take a 5 minute break.' });
      } else {
        setMode('work');
        setTime(workTime);
        new Notification('Back to work!', { body: 'Break is over. Time to focus!' });
      }
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTime(mode === 'work' ? workTime : breakTime);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setTime(newMode === 'work' ? workTime : breakTime);
    setIsRunning(false);
  };

  const progress = mode === 'work' 
    ? ((workTime - time) / workTime) * 100 
    : ((breakTime - time) / breakTime) * 100;

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'work' ? 'default' : 'outline'}
          className="flex-1 gap-2"
          onClick={() => switchMode('work')}
        >
          <BookOpen className="w-4 h-4" />
          Focus
        </Button>
        <Button
          variant={mode === 'break' ? 'default' : 'outline'}
          className="flex-1 gap-2"
          onClick={() => switchMode('break')}
        >
          <Coffee className="w-4 h-4" />
          Break
        </Button>
      </div>

      {/* Timer display */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-40 h-40 -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
        </div>
        <div className="relative text-center">
          <p className="text-5xl font-mono font-medium">{formatTime(time)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'work' ? 'Focus time' : 'Break time'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handleStartStop}
          size="lg"
          className="gap-2 w-28"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={handleReset} size="lg" variant="outline">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Sessions count */}
      <p className="text-center text-sm text-muted-foreground">
        Sessions completed: {sessions}
      </p>
    </div>
  );
};
