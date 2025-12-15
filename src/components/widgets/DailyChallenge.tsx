import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Check } from 'lucide-react';
import { toast } from 'sonner';

const CHALLENGES = [
  { id: 'tasks3', text: 'Complete 3 tasks' },
  { id: 'trivia5', text: 'Answer 5 trivia questions' },
  { id: 'focus15', text: 'Focus for 15 minutes' },
  { id: 'games2', text: 'Play 2 mini-games' },
  { id: 'streak3', text: 'Get a 3-day streak' },
  { id: 'typing30', text: 'Type at 30+ WPM' },
  { id: 'math10', text: 'Solve 10 math problems' },
];

export const DailyChallenge = () => {
  const [todaysChallenges, setTodaysChallenges] = useState<typeof CHALLENGES>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('daily-challenges');
    const data = stored ? JSON.parse(stored) : null;
    
    if (data?.date === today) {
      setTodaysChallenges(data.challenges);
      setCompleted(data.completed || []);
    } else {
      const shuffled = [...CHALLENGES].sort(() => Math.random() - 0.5).slice(0, 3);
      setTodaysChallenges(shuffled);
      setCompleted([]);
      localStorage.setItem('daily-challenges', JSON.stringify({ date: today, challenges: shuffled, completed: [] }));
    }
  }, []);

  const completeChallenge = (id: string) => {
    if (completed.includes(id)) return;
    
    const newCompleted = [...completed, id];
    setCompleted(newCompleted);
    toast.success('Challenge complete!');
    
    const today = new Date().toDateString();
    localStorage.setItem('daily-challenges', JSON.stringify({ 
      date: today, 
      challenges: todaysChallenges, 
      completed: newCompleted 
    }));
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">Daily Challenges</h3>
      </div>
      
      <div className="space-y-2">
        {todaysChallenges.map((challenge) => {
          const isCompleted = completed.includes(challenge.id);
          return (
            <div
              key={challenge.id}
              className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                isCompleted ? 'bg-primary/20' : 'bg-secondary/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                )}
                <span className={`text-xs ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                  {challenge.text}
                </span>
              </div>
              {!isCompleted && (
                <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => completeChallenge(challenge.id)}>
                  ✓
                </Button>
              )}
            </div>
          );
        })}
      </div>
      
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        {completed.length}/{todaysChallenges.length} completed
      </p>
    </Card>
  );
};