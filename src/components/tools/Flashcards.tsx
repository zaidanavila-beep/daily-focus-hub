import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

const STORAGE_KEY = 'study-flashcards';

export const Flashcards = () => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      front: newFront.trim(),
      back: newBack.trim(),
    };
    setCards(prev => [...prev, newCard]);
    setNewFront('');
    setNewBack('');
    setIsCreating(false);
    setCurrentIndex(cards.length);
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    if (currentIndex >= cards.length - 1) {
      setCurrentIndex(Math.max(0, cards.length - 2));
    }
    setIsFlipped(false);
  };

  const shuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const navigate = (direction: 'prev' | 'next') => {
    setIsFlipped(false);
    if (direction === 'prev') {
      setCurrentIndex(prev => (prev > 0 ? prev - 1 : cards.length - 1));
    } else {
      setCurrentIndex(prev => (prev < cards.length - 1 ? prev + 1 : 0));
    }
  };

  const currentCard = cards[currentIndex];

  if (isCreating) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground">Create New Flashcard</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Front (Question)</label>
            <Textarea
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              placeholder="Enter the question or term..."
              className="resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Back (Answer)</label>
            <Textarea
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              placeholder="Enter the answer or definition..."
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreating(false)} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={addCard} className="flex-1" disabled={!newFront.trim() || !newBack.trim()}>
            Add Card
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : 'No cards'}
        </span>
        <div className="flex gap-2">
          {cards.length > 1 && (
            <Button size="icon" variant="ghost" onClick={shuffle} title="Shuffle">
              <Shuffle className="w-4 h-4" />
            </Button>
          )}
          <Button size="icon" variant="ghost" onClick={() => setIsCreating(true)} title="Add card">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {cards.length === 0 ? (
        <Card className="h-48 flex items-center justify-center text-muted-foreground text-sm text-center p-4">
          <div>
            <p>No flashcards yet</p>
            <Button onClick={() => setIsCreating(true)} variant="link" className="mt-2">
              Create your first card
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card
            className="h-48 flex items-center justify-center p-6 cursor-pointer transition-all duration-300 hover:shadow-lg"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
            }}
          >
            <div className="text-center" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}>
              <p className="text-xs text-muted-foreground mb-2">
                {isFlipped ? 'Answer' : 'Question'}
              </p>
              <p className="font-medium text-lg">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Button size="icon" variant="outline" onClick={() => navigate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => setIsFlipped(false)}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteCard(currentCard.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Button size="icon" variant="outline" onClick={() => navigate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
