import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle, RotateCcw } from 'lucide-react';
import { usePet } from '@/hooks/usePet';
import { toast } from 'sonner';

const WORDS = [
  'STUDY', 'LEARN', 'FOCUS', 'SMART', 'BRAIN', 'THINK',
  'MATH', 'READ', 'WORK', 'BEST', 'GOAL', 'PLAN'
];

export const WordScramble = () => {
  const { addXP } = usePet();
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const scrambleWord = (word: string) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const newWord = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    let scrambledWord = scrambleWord(word);
    while (scrambledWord === word) {
      scrambledWord = scrambleWord(word);
    }
    setScrambled(scrambledWord);
    setUserGuess('');
    setShowHint(false);
  };

  useEffect(() => {
    newWord();
  }, []);

  const handleGuess = (letter: string) => {
    const newGuess = userGuess + letter;
    setUserGuess(newGuess);

    if (newGuess.length === currentWord.length) {
      if (newGuess === currentWord) {
        setScore(prev => prev + 1);
        addXP(5);
        toast.success('🎉 Correct! +5 XP');
        setTimeout(newWord, 1000);
      } else {
        toast.error('Try again!');
        setUserGuess('');
      }
    }
  };

  const availableLetters = scrambled.split('').filter((letter, index) => {
    const usedCount = userGuess.split('').filter(l => l === letter).length;
    const totalCount = scrambled.split('').filter(l => l === letter).length;
    return usedCount < totalCount;
  });

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Word Scramble</h3>
        </div>
        <span className="text-xs text-muted-foreground">Score: {score}</span>
      </div>

      <div className="text-center mb-4">
        <div className="flex justify-center gap-1 mb-4">
          {currentWord.split('').map((_, index) => (
            <div
              key={index}
              className="w-8 h-10 border-2 border-border rounded flex items-center justify-center text-lg font-bold"
            >
              {userGuess[index] || ''}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {scrambled.split('').map((letter, index) => {
            const isUsed = userGuess.includes(letter) && 
              userGuess.split('').filter(l => l === letter).length > 
              scrambled.slice(0, index).split('').filter(l => l === letter).length;
            
            return (
              <button
                key={index}
                onClick={() => !userGuess.includes(letter) || availableLetters.includes(letter) ? handleGuess(letter) : null}
                disabled={!availableLetters.includes(letter)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  availableLetters.filter(l => l === letter).length > 0
                    ? 'bg-secondary hover:bg-secondary/80 hover:scale-105'
                    : 'bg-muted opacity-50'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setUserGuess('')} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-1" />
          Clear
        </Button>
        <Button variant="outline" size="sm" onClick={newWord} className="flex-1">
          Skip
        </Button>
      </div>
    </Card>
  );
};
