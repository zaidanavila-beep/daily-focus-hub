import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

export const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps((prev) => [time, ...prev]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Display */}
      <div className="text-center py-6">
        <p className="text-5xl font-mono font-medium tracking-tight">
          {formatTime(time)}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handleStartStop}
          size="lg"
          variant={isRunning ? 'secondary' : 'default'}
          className="gap-2 w-28"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={handleLap} size="lg" variant="outline" disabled={!isRunning}>
          <Flag className="w-4 h-4" />
        </Button>
        <Button onClick={handleReset} size="lg" variant="outline">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="mt-4 max-h-32 overflow-y-auto space-y-1">
          {laps.map((lap, index) => (
            <div
              key={index}
              className="flex justify-between text-sm py-1 px-2 rounded bg-secondary/50"
            >
              <span className="text-muted-foreground">Lap {laps.length - index}</span>
              <span className="font-mono">{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
