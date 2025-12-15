import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!targetDate || !isActive) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        setIsActive(false);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate, isActive]);

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">Countdown</h3>
      </div>
      
      <Input
        type="datetime-local"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        className="mb-3 text-xs"
      />
      
      <div className="grid grid-cols-4 gap-1 text-center mb-3">
        {Object.entries(timeLeft).map(([key, val]) => (
          <div key={key} className="bg-secondary/50 rounded-lg p-2">
            <span className="text-lg font-bold">{val}</span>
            <span className="text-[10px] block text-muted-foreground">{key}</span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={() => setIsActive(!isActive)} disabled={!targetDate}>
          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
        <Button size="sm" variant="outline" onClick={() => { setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 }); setIsActive(false); }}>
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};