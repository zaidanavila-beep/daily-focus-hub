import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePet } from '@/hooks/usePet';
import { Palette, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const COLORS = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Cyan', hex: '#06b6d4' },
];

export const ColorMatch = () => {
  const { addXP } = usePet();
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [textColor, setTextColor] = useState(COLORS[0]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const generateRound = () => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    const text = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(target);
    setTextColor(text);
  };

  useEffect(() => {
    generateRound();
  }, []);

  const handleAnswer = (matchesText: boolean) => {
    const isCorrect = matchesText ? targetColor.name === textColor.name : targetColor.hex === textColor.hex && targetColor.name !== textColor.name;
    
    // Correct if: clicked "Name" and name matches, OR clicked "Color" and colors match but names don't
    const actuallyCorrect = matchesText 
      ? targetColor.name === textColor.name 
      : targetColor.name !== textColor.name;
    
    if (actuallyCorrect) {
      setScore(s => s + 1);
      if ((score + 1) % 5 === 0) {
        addXP(10);
        toast.success('+10 XP! Keep going!');
      }
    } else {
      setLives(l => {
        if (l <= 1) {
          setGameOver(true);
          addXP(Math.floor(score / 2));
          toast.info(`Game Over! +${Math.floor(score / 2)} XP`);
        }
        return l - 1;
      });
    }
    generateRound();
  };

  const reset = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    generateRound();
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Color Match</h3>
        </div>
        <div className="flex gap-2 text-xs">
          <span>❤️ {lives}</span>
          <span className="font-bold text-primary">{score}</span>
        </div>
      </div>
      
      {!gameOver ? (
        <>
          <div className="text-center py-4 mb-3 bg-secondary/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Does the text match its color?</p>
            <span 
              className="text-2xl font-bold"
              style={{ color: textColor.hex }}
            >
              {targetColor.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={() => handleAnswer(true)}>
              ✓ Yes
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleAnswer(false)}>
              ✗ No
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <span className="text-3xl mb-2 block">🎨</span>
          <p className="font-bold">Score: {score}</p>
          <Button size="sm" className="mt-3" onClick={reset}>
            <RotateCcw className="w-3 h-3 mr-1" /> Retry
          </Button>
        </div>
      )}
    </Card>
  );
};