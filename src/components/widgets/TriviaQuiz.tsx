import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const TRIVIA = [
  { q: 'What planet is known as the Red Planet?', a: 'Mars', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'] },
  { q: 'How many continents are there?', a: '7', options: ['5', '6', '7', '8'] },
  { q: 'What is the largest mammal?', a: 'Blue Whale', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippo'] },
  { q: 'What gas do plants breathe in?', a: 'CO2', options: ['Oxygen', 'Nitrogen', 'CO2', 'Helium'] },
  { q: 'How many legs does a spider have?', a: '8', options: ['6', '8', '10', '12'] },
  { q: 'What is H2O?', a: 'Water', options: ['Salt', 'Water', 'Sugar', 'Oxygen'] },
  { q: 'Which planet is closest to the Sun?', a: 'Mercury', options: ['Venus', 'Mercury', 'Earth', 'Mars'] },
  { q: 'What is the hardest natural substance?', a: 'Diamond', options: ['Gold', 'Iron', 'Diamond', 'Quartz'] },
];

export const TriviaQuiz = () => {
  const [current, setCurrent] = useState(() => Math.floor(Math.random() * TRIVIA.length));
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const trivia = TRIVIA[current];

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    if (answer === trivia.a) {
      setScore(s => s + 1);
      toast.success('Correct!');
    } else {
      toast.error(`Wrong! It was ${trivia.a}`);
    }
  };

  const nextQuestion = () => {
    setCurrent(Math.floor(Math.random() * TRIVIA.length));
    setSelected(null);
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Trivia</h3>
        </div>
        <span className="text-xs text-primary font-bold">Score: {score}</span>
      </div>
      
      <p className="text-sm mb-3 font-medium">{trivia.q}</p>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        {trivia.options.map((opt) => (
          <Button
            key={opt}
            size="sm"
            variant={selected === opt ? (opt === trivia.a ? 'default' : 'destructive') : 'outline'}
            className="text-xs"
            onClick={() => !selected && handleAnswer(opt)}
            disabled={!!selected}
          >
            {opt}
          </Button>
        ))}
      </div>
      
      {selected && (
        <Button size="sm" className="w-full" onClick={nextQuestion}>
          <RefreshCw className="w-3 h-3 mr-1" /> Next
        </Button>
      )}
    </Card>
  );
};