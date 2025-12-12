import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dices, RotateCcw } from 'lucide-react';
import { usePet } from '@/hooks/usePet';
import { toast } from 'sonner';

export const DiceRoller = () => {
  const { addXP } = usePet();
  const [dice, setDice] = useState<number[]>([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setRollCount(prev => prev + 1);

    // Animate rolling
    let rolls = 0;
    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
      rolls++;
      if (rolls >= 10) {
        clearInterval(interval);
        const final = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ];
        setDice(final);
        setIsRolling(false);

        // Bonus for doubles!
        if (final[0] === final[1]) {
          addXP(5);
          toast.success(`🎲 Doubles! +5 XP`);
        }
      }
    }, 50);
  };

  const getDiceFace = (value: number) => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[value - 1];
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Dices className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Dice Roller</h3>
        </div>
        <span className="text-xs text-muted-foreground">Rolls: {rollCount}</span>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {dice.map((value, index) => (
          <div
            key={index}
            className={`text-5xl transition-transform ${isRolling ? 'animate-spin' : ''}`}
          >
            {getDiceFace(value)}
          </div>
        ))}
      </div>

      <div className="text-center mb-3">
        <span className="text-lg font-bold">Total: {dice[0] + dice[1]}</span>
        {dice[0] === dice[1] && !isRolling && (
          <span className="ml-2 text-primary text-sm">Doubles!</span>
        )}
      </div>

      <Button 
        onClick={rollDice} 
        disabled={isRolling}
        className="w-full"
        size="sm"
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </Button>
    </Card>
  );
};
