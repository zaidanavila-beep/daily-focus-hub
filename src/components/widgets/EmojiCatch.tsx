import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePet } from '@/hooks/usePet';
import { Target, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const EMOJIS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑'];
const BOMB = '💣';

export const EmojiCatch = () => {
  const { addXP } = usePet();
  const [items, setItems] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nextId, setNextId] = useState(0);

  const spawnItem = useCallback(() => {
    const isBomb = Math.random() < 0.2;
    const emoji = isBomb ? BOMB : EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const newItem = {
      id: nextId,
      emoji,
      x: Math.random() * 80 + 10,
      y: -10,
    };
    setNextId(id => id + 1);
    setItems(prev => [...prev, newItem]);
  }, [nextId]);

  useEffect(() => {
    if (!isPlaying) return;
    const spawnInterval = setInterval(spawnItem, 1000);
    return () => clearInterval(spawnInterval);
  }, [isPlaying, spawnItem]);

  useEffect(() => {
    if (!isPlaying) return;
    const moveInterval = setInterval(() => {
      setItems(prev => {
        const updated = prev.map(item => ({ ...item, y: item.y + 5 }));
        const missed = updated.filter(item => item.y > 100 && item.emoji !== BOMB);
        if (missed.length > 0) {
          setLives(l => {
            const newLives = l - missed.length;
            if (newLives <= 0) {
              setIsPlaying(false);
              addXP(Math.floor(score / 2));
              toast.info(`Game Over! +${Math.floor(score / 2)} XP`);
            }
            return Math.max(0, newLives);
          });
        }
        return updated.filter(item => item.y <= 100);
      });
    }, 100);
    return () => clearInterval(moveInterval);
  }, [isPlaying, score]);

  const catchItem = (id: number, emoji: string) => {
    if (emoji === BOMB) {
      setLives(l => {
        if (l <= 1) {
          setIsPlaying(false);
          addXP(Math.floor(score / 2));
          toast.info(`Boom! +${Math.floor(score / 2)} XP`);
        }
        return l - 1;
      });
    } else {
      setScore(s => s + 1);
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setItems([]);
    setIsPlaying(true);
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Emoji Catch</h3>
        </div>
        {isPlaying && (
          <div className="flex gap-2 text-xs">
            <span>❤️ {lives}</span>
            <span className="text-primary font-bold">{score}</span>
          </div>
        )}
      </div>
      
      {!isPlaying ? (
        <div className="text-center py-6">
          {lives === 0 && <p className="mb-2 font-bold">Score: {score}</p>}
          <p className="text-xs text-muted-foreground mb-3">Tap fruits! Avoid 💣</p>
          <Button onClick={startGame}>
            {lives === 0 ? <><RotateCcw className="w-3 h-3 mr-1" /> Retry</> : '▶ Play'}
          </Button>
        </div>
      ) : (
        <div className="relative h-32 bg-secondary/20 rounded-xl overflow-hidden">
          {items.map(item => (
            <button
              key={item.id}
              className="absolute text-2xl transition-transform hover:scale-125 cursor-pointer"
              style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => catchItem(item.id, item.emoji)}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
};