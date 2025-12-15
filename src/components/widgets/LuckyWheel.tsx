import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePet } from '@/hooks/usePet';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const PRIZES = [
  { text: '5 XP', xp: 5, color: 'bg-red-500' },
  { text: '10 XP', xp: 10, color: 'bg-blue-500' },
  { text: '15 XP', xp: 15, color: 'bg-green-500' },
  { text: '20 XP', xp: 20, color: 'bg-yellow-500' },
  { text: '25 XP', xp: 25, color: 'bg-purple-500' },
  { text: '50 XP', xp: 50, color: 'bg-pink-500' },
  { text: '1 XP', xp: 1, color: 'bg-gray-500' },
  { text: '100 XP', xp: 100, color: 'bg-orange-500' },
];

export const LuckyWheel = () => {
  const { addXP } = usePet();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastSpin, setLastSpin] = useState(() => {
    const stored = localStorage.getItem('lucky-wheel-last');
    return stored ? new Date(stored) : null;
  });

  const canSpin = !lastSpin || (new Date().getTime() - lastSpin.getTime()) > 3600000; // 1 hour

  const spin = () => {
    if (!canSpin || isSpinning) return;
    
    setIsSpinning(true);
    const spins = 5 + Math.random() * 5; // 5-10 full spins
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prizeAngle = (prizeIndex / PRIZES.length) * 360;
    const newRotation = rotation + (spins * 360) + (360 - prizeAngle);
    
    setRotation(newRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      const prize = PRIZES[prizeIndex];
      addXP(prize.xp);
      toast.success(`🎉 You won ${prize.text}!`);
      
      const now = new Date();
      setLastSpin(now);
      localStorage.setItem('lucky-wheel-last', now.toISOString());
    }, 3000);
  };

  const getTimeUntilSpin = () => {
    if (!lastSpin) return '';
    const diff = 3600000 - (new Date().getTime() - lastSpin.getTime());
    if (diff <= 0) return '';
    const mins = Math.floor(diff / 60000);
    return `${mins}m`;
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">Lucky Wheel</h3>
      </div>
      
      <div className="relative w-32 h-32 mx-auto mb-3">
        {/* Wheel */}
        <div 
          className="w-full h-full rounded-full overflow-hidden border-4 border-primary/50 transition-transform duration-[3000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {PRIZES.map((prize, i) => (
            <div
              key={i}
              className={`absolute w-1/2 h-1/2 origin-bottom-right ${prize.color}`}
              style={{
                transform: `rotate(${i * 45}deg) skewY(-45deg)`,
                left: '50%',
                top: '0',
              }}
            />
          ))}
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-primary z-10" />
        
        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full border-2 border-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      </div>
      
      <Button 
        className="w-full" 
        size="sm" 
        onClick={spin} 
        disabled={!canSpin || isSpinning}
      >
        {isSpinning ? 'Spinning...' : canSpin ? 'Spin!' : `Wait ${getTimeUntilSpin()}`}
      </Button>
    </Card>
  );
};