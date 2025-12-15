import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cherry } from 'lucide-react';
import { toast } from 'sonner';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];

export const SlotMachine = () => {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wins, setWins] = useState(0);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Animate spinning
    let spins = 0;
    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      spins++;
      
      if (spins >= 15) {
        clearInterval(interval);
        const final = [
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        ];
        setReels(final);
        setIsSpinning(false);

        // Check for wins
        if (final[0] === final[1] && final[1] === final[2]) {
          setWins(w => w + 1);
          if (final[0] === '7️⃣') {
            toast.success('🎰 JACKPOT! Triple 7s!');
          } else if (final[0] === '💎') {
            toast.success('💎 Diamond win!');
          } else {
            toast.success('🎉 Winner!');
          }
        } else if (final[0] === final[1] || final[1] === final[2]) {
          toast.info('Almost! Two in a row!');
        }
      }
    }, 80);
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cherry className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Slots</h3>
        </div>
        <span className="text-xs text-primary font-bold">Wins: {wins}</span>
      </div>

      <div className="bg-gradient-to-b from-secondary to-secondary/50 rounded-xl p-3 mb-3">
        <div className="flex justify-center gap-2">
          {reels.map((symbol, i) => (
            <div
              key={i}
              className={`w-12 h-14 bg-background rounded-lg flex items-center justify-center text-2xl border-2 border-primary/30 shadow-inner ${
                isSpinning ? 'animate-pulse' : ''
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={spin} 
        disabled={isSpinning}
        className="w-full"
        size="sm"
      >
        {isSpinning ? '🎰 Spinning...' : '🎰 SPIN'}
      </Button>
    </Card>
  );
};