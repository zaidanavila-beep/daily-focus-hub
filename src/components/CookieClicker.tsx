import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { usePet } from '@/hooks/usePet';
import { toast } from 'sonner';

const STORAGE_KEY = 'cookie-clicker';

export const CookieClicker = () => {
  const { addXP } = usePet();
  const [cookies, setCookies] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored) : 0;
  });
  const [clickEffect, setClickEffect] = useState(false);
  const [lastXPReward, setLastXPReward] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY + '-xp');
    return stored ? parseInt(stored) : 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, cookies.toString());

    // Give XP every 50 cookies
    const xpThreshold = Math.floor(cookies / 50);
    if (xpThreshold > lastXPReward) {
      addXP(5);
      setLastXPReward(xpThreshold);
      localStorage.setItem(STORAGE_KEY + '-xp', xpThreshold.toString());
      toast.success('🍪 50 cookies! +5 XP');
    }
  }, [cookies]);

  const handleClick = () => {
    setCookies(prev => prev + 1);
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 100);
  };

  const getMilestone = () => {
    if (cookies >= 1000) return '🏆 Cookie Master';
    if (cookies >= 500) return '⭐ Cookie Pro';
    if (cookies >= 100) return '🍪 Cookie Fan';
    if (cookies >= 50) return '🌟 Getting Started';
    return 'Click to earn!';
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cookie className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Cookie Clicker</h3>
        </div>
        <span className="text-xs text-muted-foreground">{getMilestone()}</span>
      </div>

      <div className="text-center">
        <button
          onClick={handleClick}
          className={`text-6xl mb-2 transition-transform hover:scale-110 active:scale-95 ${
            clickEffect ? 'scale-125' : ''
          }`}
        >
          🍪
        </button>
        <p className="text-2xl font-bold">{cookies.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">cookies collected</p>
      </div>
    </Card>
  );
};
