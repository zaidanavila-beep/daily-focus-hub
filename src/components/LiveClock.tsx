import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = format(time, 'HH');
  const minutes = format(time, 'mm');
  const seconds = format(time, 'ss');
  const period = format(time, 'a');

  return (
    <div className="text-center">
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-6xl md:text-7xl font-light tracking-tight tabular-nums">
          {hours}
        </span>
        <span className="text-5xl md:text-6xl font-light animate-pulse-soft">:</span>
        <span className="text-6xl md:text-7xl font-light tracking-tight tabular-nums">
          {minutes}
        </span>
        <div className="flex flex-col ml-2">
          <span className="text-2xl font-light tabular-nums text-muted-foreground">
            {seconds}
          </span>
          <span className="text-sm font-medium text-muted-foreground uppercase">
            {period}
          </span>
        </div>
      </div>
    </div>
  );
};
