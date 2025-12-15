import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const EMOJI_PAIRS = ['🎮', '🎯', '🎨', '🎸', '🎭', '🎪', '🎬', '🎤'];

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MiniGames = () => {
  const [cards, setCards] = useState<MemoryCard[]>(() => initializeCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  function initializeCards(): MemoryCard[] {
    const pairs = EMOJI_PAIRS.slice(0, 6);
    const allEmojis = [...pairs, ...pairs];
    return allEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
  }

  const resetGame = () => {
    setCards(initializeCards());
    setFlippedCards([]);
    setMoves(0);
    setIsLocked(false);
  };

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c =>
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === first || c.id === second
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);

          const matchedCount = newCards.filter(c => c.isMatched).length + 2;
          if (matchedCount === cards.length) {
            toast.success(`🎉 You won in ${moves + 1} moves!`);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === first || c.id === second
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const matchedCount = cards.filter(c => c.isMatched).length;
  const isWon = matchedCount === cards.length;

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Memory Game</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Moves: {moves}</span>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={resetGame}>
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg text-xl transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-primary/20 scale-95'
                : 'bg-secondary hover:bg-secondary/80'
            } ${card.isMatched ? 'opacity-50' : ''}`}
          >
            {card.isFlipped || card.isMatched ? card.emoji : '?'}
          </button>
        ))}
      </div>

      {isWon && (
        <div className="mt-4 text-center">
          <p className="text-sm text-primary font-medium">🎉 Great job!</p>
          <Button size="sm" variant="outline" className="mt-2" onClick={resetGame}>
            Play Again
          </Button>
        </div>
      )}
    </Card>
  );
};
