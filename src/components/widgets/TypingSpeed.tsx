import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePet } from '@/hooks/usePet';
import { Keyboard, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const WORDS = ['apple', 'banana', 'cherry', 'dragon', 'elephant', 'forest', 'galaxy', 'harmony', 'island', 'jungle', 'kitchen', 'lemon', 'mountain', 'notebook', 'ocean', 'pizza', 'queen', 'rainbow', 'sunset', 'tiger'];

export const TypingSpeed = () => {
  const { addXP } = usePet();
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateWords = () => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, 5));
    setCurrentIndex(0);
    setInput('');
    setStartTime(null);
    setWpm(0);
    setFinished(false);
  };

  useEffect(() => {
    generateWords();
  }, []);

  const handleInput = (value: string) => {
    if (!startTime) setStartTime(Date.now());
    setInput(value);
    
    if (value.endsWith(' ') && value.trim() === words[currentIndex]) {
      if (currentIndex === words.length - 1) {
        const time = (Date.now() - (startTime || Date.now())) / 1000 / 60;
        const calculatedWpm = Math.round(words.length / time);
        setWpm(calculatedWpm);
        setFinished(true);
        const xp = Math.min(Math.floor(calculatedWpm / 5), 30);
        addXP(xp);
        toast.success(`+${xp} XP! ${calculatedWpm} WPM!`);
      } else {
        setCurrentIndex(i => i + 1);
      }
      setInput('');
    }
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Typing Speed</h3>
        </div>
        {wpm > 0 && <span className="text-xs font-bold text-primary">{wpm} WPM</span>}
      </div>
      
      {!finished ? (
        <>
          <div className="flex flex-wrap gap-1 mb-3 p-2 bg-secondary/30 rounded-lg min-h-[40px]">
            {words.map((word, i) => (
              <span
                key={i}
                className={`text-sm ${i === currentIndex ? 'text-primary font-bold' : i < currentIndex ? 'text-muted-foreground line-through' : 'text-foreground'}`}
              >
                {word}
              </span>
            ))}
          </div>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Type the words..."
            className="text-sm"
          />
        </>
      ) : (
        <div className="text-center py-4">
          <span className="text-4xl mb-2 block">🎉</span>
          <p className="font-bold text-lg">{wpm} WPM</p>
          <Button size="sm" className="mt-3" onClick={generateWords}>
            <RotateCcw className="w-3 h-3 mr-1" /> Try Again
          </Button>
        </div>
      )}
    </Card>
  );
};