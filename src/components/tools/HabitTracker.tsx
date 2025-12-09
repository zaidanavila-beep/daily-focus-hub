import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Check, Flame } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

const STORAGE_KEY = 'habit-tracker-data';

const getToday = () => new Date().toISOString().split('T')[0];

const getStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;
  
  const sortedDates = [...dates].sort().reverse();
  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) return 0;
  
  let streak = 0;
  let currentDate = new Date(sortedDates.includes(today) ? today : yesterday);
  
  for (const dateStr of sortedDates) {
    const expectedDate = currentDate.toISOString().split('T')[0];
    if (dateStr === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dateStr < expectedDate) {
      break;
    }
  }
  
  return streak;
};

const getLast7Days = (): string[] => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
};

export const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: newHabit.trim(),
      completedDates: [],
    };
    setHabits(prev => [...prev, habit]);
    setNewHabit('');
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleToday = (id: string) => {
    const today = getToday();
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      const isCompleted = habit.completedDates.includes(today);
      return {
        ...habit,
        completedDates: isCompleted
          ? habit.completedDates.filter(d => d !== today)
          : [...habit.completedDates, today],
      };
    }));
  };

  const last7Days = getLast7Days();
  const today = getToday();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit..."
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
        />
        <Button size="icon" onClick={addHabit} disabled={!newHabit.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {habits.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground text-sm">
          <p>No habits yet. Add one to start tracking!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {habits.map(habit => {
            const streak = getStreak(habit.completedDates);
            const isCompletedToday = habit.completedDates.includes(today);
            
            return (
              <Card key={habit.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant={isCompletedToday ? 'default' : 'outline'}
                      className="h-8 w-8"
                      onClick={() => toggleToday(habit.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <span className="font-medium text-sm">{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {streak > 0 && (
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{streak}</span>
                      </div>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  {last7Days.map((date, i) => {
                    const isCompleted = habit.completedDates.includes(date);
                    const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' })[0];
                    return (
                      <div key={date} className="flex-1 text-center">
                        <p className="text-[10px] text-muted-foreground mb-1">{dayName}</p>
                        <div
                          className={`h-6 rounded-md ${
                            isCompleted
                              ? 'bg-primary'
                              : 'bg-secondary'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
