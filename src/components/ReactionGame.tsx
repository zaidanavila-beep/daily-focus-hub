import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, RotateCcw } from 'lucide-react';

export const ReactionGame = () => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'result' | 'early'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    const stored = localStorage.getItem('reaction-best');
    return stored ? parseInt(stored) : 999;
  });

  useEffect(() => {
    if (gameState === 'ready') {
      const delay = 1000 + Math.random() * 3000;
      const timeout = setTimeout(() => {
        setStartTime(Date.now());
        setGameState('go');
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState('ready');
  };

  const handleClick = () => {
    if (gameState === 'ready') {
      setGameState('early');
    } else if (gameState === 'go') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('result');

      if (time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reaction-best', time.toString());
      }
    }
  };

  const reset = () => {
    setGameState('waiting');
    setReactionTime(0);
  };

  const getColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-secondary';
      case 'ready': return 'bg-red-500';
      case 'go': return 'bg-green-500';
      case 'result': return 'bg-primary';
      case 'early': return 'bg-orange-500';
    }
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Reaction Test</h3>
        </div>
        <span className="text-xs text-muted-foreground">Best: {bestTime}ms</span>
      </div>

      <button
        onClick={gameState === 'waiting' ? startGame : handleClick}
        className={`w-full h-24 rounded-xl transition-all ${getColor()} flex items-center justify-center text-white font-medium`}
      >
        {gameState === 'waiting' && 'Click to Start'}
        {gameState === 'ready' && 'Wait for green...'}
        {gameState === 'go' && 'CLICK NOW!'}
        {gameState === 'result' && `${reactionTime}ms`}
        {gameState === 'early' && 'Too early!'}
      </button>

      {(gameState === 'result' || gameState === 'early') && (
        <Button onClick={reset} variant="ghost" size="sm" className="w-full mt-2">
          <RotateCcw className="w-4 h-4 mr-1" />
          Try Again
        </Button>
      )}
    </Card>
  );
};
