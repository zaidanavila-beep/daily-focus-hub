import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePet } from '@/hooks/usePet';
import { Calculator, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export const MathChallenge = () => {
  const { addXP } = usePet();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateProblem = () => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 12) + 1;
    let b = Math.floor(Math.random() * 12) + 1;
    if (op === '-' && b > a) [a, b] = [b, a];
    setNum1(a);
    setNum2(b);
    setOperator(op);
    setAnswer('');
  };

  const getCorrectAnswer = () => {
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '×': return num1 * num2;
      default: return 0;
    }
  };

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          const xp = score * 2 + streak;
          addXP(xp);
          toast.success(`Time's up! +${xp} XP`);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const checkAnswer = () => {
    if (parseInt(answer) === getCorrectAnswer()) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      generateProblem();
    } else {
      setStreak(0);
      toast.error(`It was ${getCorrectAnswer()}`);
      generateProblem();
    }
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setIsPlaying(true);
    generateProblem();
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Math Rush</h3>
        </div>
        {isPlaying && (
          <div className="flex gap-2 text-xs">
            <span>⏱️ {timeLeft}s</span>
            <span className="text-primary font-bold">{score}</span>
          </div>
        )}
      </div>
      
      {!isPlaying ? (
        <div className="text-center py-4">
          {timeLeft === 0 && <p className="mb-2 font-bold">Score: {score}</p>}
          <Button onClick={startGame}>
            {timeLeft === 0 ? <><RotateCcw className="w-3 h-3 mr-1" /> Play Again</> : '▶ Start'}
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center py-3 bg-secondary/30 rounded-xl mb-3">
            <span className="text-2xl font-bold">{num1} {operator} {num2} = ?</span>
            {streak > 2 && <p className="text-xs text-primary mt-1">🔥 {streak} streak!</p>}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Answer"
              className="text-center"
              autoFocus
            />
            <Button onClick={checkAnswer}>Go</Button>
          </div>
        </>
      )}
    </Card>
  );
};