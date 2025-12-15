import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, RefreshCw } from 'lucide-react';

const POLLS = [
  { q: 'Best study snack?', options: ['🍿 Popcorn', '🍎 Fruit', '🍫 Chocolate', '🥜 Nuts'] },
  { q: 'Favorite season?', options: ['🌸 Spring', '☀️ Summer', '🍂 Fall', '❄️ Winter'] },
  { q: 'Morning or night?', options: ['🌅 Morning', '🌙 Night', '🌤️ Afternoon', '😴 Sleep'] },
  { q: 'Best subject?', options: ['📐 Math', '📖 English', '🔬 Science', '🎨 Art'] },
  { q: 'Dream pet?', options: ['🐕 Dog', '🐈 Cat', '🐰 Bunny', '🦜 Bird'] },
  { q: 'Favorite music?', options: ['🎸 Rock', '🎹 Pop', '🎺 Jazz', '🎻 Classical'] },
];

export const QuickPoll = () => {
  const [pollIndex, setPollIndex] = useState(() => Math.floor(Math.random() * POLLS.length));
  const [votes, setVotes] = useState<number[]>([0, 0, 0, 0]);
  const [voted, setVoted] = useState(false);

  const poll = POLLS[pollIndex];
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const handleVote = (index: number) => {
    const newVotes = [...votes];
    newVotes[index] += 1 + Math.floor(Math.random() * 10); // Simulate other votes
    setVotes(newVotes);
    setVoted(true);
  };

  const nextPoll = () => {
    setPollIndex((pollIndex + 1) % POLLS.length);
    setVotes([0, 0, 0, 0]);
    setVoted(false);
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Quick Poll</h3>
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={nextPoll}>
          <RefreshCw className="w-3 h-3" />
        </Button>
      </div>
      
      <p className="text-sm font-medium mb-3">{poll.q}</p>
      
      <div className="space-y-2">
        {poll.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !voted && handleVote(i)}
            disabled={voted}
            className={`w-full text-left p-2 rounded-lg text-sm transition-all ${
              voted 
                ? 'bg-secondary/50' 
                : 'bg-secondary/30 hover:bg-secondary/60 cursor-pointer'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{opt}</span>
              {voted && <span className="text-xs text-muted-foreground">{Math.round((votes[i] / totalVotes) * 100)}%</span>}
            </div>
            {voted && (
              <div className="h-1 bg-secondary rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(votes[i] / totalVotes) * 100}%` }}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
};