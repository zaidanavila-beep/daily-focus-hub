import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePet } from '@/hooks/usePet';
import { Grid3X3, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

export const PatternMemory = () => {
  const { addXP } = usePet();
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');

  const generatePattern = (length: number) => {
    const newPattern = Array.from({ length }, () => Math.floor(Math.random() * 4));
    setPattern(newPattern);
    return newPattern;
  };

  const showPattern = async (patternToShow: number[]) => {
    setIsShowing(true);
    for (let i = 0; i < patternToShow.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setActiveIndex(patternToShow[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveIndex(null);
    }
    setIsShowing(false);
  };

  const startGame = async () => {
    setLevel(1);
    setUserPattern([]);
    setGameState('playing');
    const newPattern = generatePattern(3);
    await showPattern(newPattern);
  };

  const handleClick = async (index: number) => {
    if (isShowing || gameState !== 'playing') return;
    
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    
    // Flash the button
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(null), 200);
    
    // Check if correct so far
    if (pattern[newUserPattern.length - 1] !== index) {
      setGameState('gameover');
      const xp = (level - 1) * 5;
      addXP(xp);
      toast.error(`Wrong! +${xp} XP`);
      return;
    }
    
    // Check if pattern complete
    if (newUserPattern.length === pattern.length) {
      const newLevel = level + 1;
      setLevel(newLevel);
      setUserPattern([]);
      toast.success(`Level ${newLevel}!`);
      
      await new Promise(r => setTimeout(r, 500));
      const newPattern = generatePattern(2 + newLevel);
      await showPattern(newPattern);
    }
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Pattern</h3>
        </div>
        {gameState === 'playing' && <span className="text-xs font-bold text-primary">Lv.{level}</span>}
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={isShowing || gameState !== 'playing'}
            className={`h-12 rounded-xl transition-all duration-200 ${COLORS[i]} ${
              activeIndex === i ? 'opacity-100 scale-105 shadow-lg' : 'opacity-50'
            } ${!isShowing && gameState === 'playing' ? 'hover:opacity-75 cursor-pointer' : ''}`}
          />
        ))}
      </div>
      
      {gameState === 'idle' && (
        <Button className="w-full" size="sm" onClick={startGame}>▶ Start</Button>
      )}
      {gameState === 'gameover' && (
        <Button className="w-full" size="sm" onClick={startGame}>
          <RotateCcw className="w-3 h-3 mr-1" /> Level {level - 1} - Retry
        </Button>
      )}
      {gameState === 'playing' && isShowing && (
        <p className="text-xs text-center text-muted-foreground">Watch the pattern...</p>
      )}
      {gameState === 'playing' && !isShowing && (
        <p className="text-xs text-center text-muted-foreground">Your turn! ({userPattern.length}/{pattern.length})</p>
      )}
    </Card>
  );
};