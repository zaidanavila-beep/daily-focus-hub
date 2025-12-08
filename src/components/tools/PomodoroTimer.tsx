import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';

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
      if (mode === 'work') {
        setSessions((prev) => prev + 1);
        setMode('break');
        setTime(breakTime);
        if (Notification.permission === 'granted') {
          new Notification('Break time!', { body: 'Great work! Take a 5 minute break.' });
        }
      } else {
        setMode('work');
        setTime(workTime);
        if (Notification.permission === 'granted') {
          new Notification('Back to work!', { body: 'Break is over. Time to focus!' });
        }
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
          variant={mode === 'work' ? 'default' : 'secondary'}
          className={`flex-1 gap-2 rounded-xl ${mode === 'work' ? 'gradient-bg' : ''}`}
          onClick={() => switchMode('work')}
        >
          <BookOpen className="w-4 h-4" />
          Focus
        </Button>
        <Button
          variant={mode === 'break' ? 'default' : 'secondary'}
          className={`flex-1 gap-2 rounded-xl ${mode === 'break' ? 'gradient-bg' : ''}`}
          onClick={() => switchMode('break')}
        >
          <Coffee className="w-4 h-4" />
          Break
        </Button>
      </div>

      {/* Timer display */}
      <div className="relative py-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-44 h-44 -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="78"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
            />
            <circle
              cx="88"
              cy="88"
              r="78"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 78}
              strokeDashoffset={2 * Math.PI * 78 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative text-center">
          <p className="text-5xl font-light tabular-nums">{formatTime(time)}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === 'work' ? 'Focus time' : 'Break time'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handleStartStop}
          size="lg"
          className={`gap-2 w-32 rounded-xl ${!isRunning ? 'gradient-bg' : ''}`}
          variant={isRunning ? 'secondary' : 'default'}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={handleReset} size="lg" variant="outline" className="rounded-xl">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Sessions count */}
      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Sessions completed: <span className="font-semibold text-foreground">{sessions}</span>
        </p>
      </div>
    </div>
  );
};
