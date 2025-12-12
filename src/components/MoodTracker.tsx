import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const MOODS = [
  { emoji: '😊', label: 'Great', color: 'from-green-400 to-emerald-500' },
  { emoji: '🙂', label: 'Good', color: 'from-blue-400 to-cyan-500' },
  { emoji: '😐', label: 'Okay', color: 'from-yellow-400 to-amber-500' },
  { emoji: '😔', label: 'Low', color: 'from-orange-400 to-red-500' },
  { emoji: '😫', label: 'Stressed', color: 'from-purple-400 to-pink-500' },
];

const STORAGE_KEY = 'mood-tracker';

interface MoodEntry {
  date: string;
  mood: number;
}

export const MoodTracker = () => {
  const [todayMood, setTodayMood] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const entries: MoodEntry[] = JSON.parse(stored);
      const today = new Date().toDateString();
      const todayEntry = entries.find(e => e.date === today);
      return todayEntry?.mood ?? null;
    }
    return null;
  });

  const [weekMoods, setWeekMoods] = useState<(number | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const entries: MoodEntry[] = stored ? JSON.parse(stored) : [];
    const week: (number | null)[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const entry = entries.find(e => e.date === dateStr);
      week.push(entry?.mood ?? null);
    }
    setWeekMoods(week);
  }, [todayMood]);

  const selectMood = (index: number) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const entries: MoodEntry[] = stored ? JSON.parse(stored) : [];
    const today = new Date().toDateString();
    const filtered = entries.filter(e => e.date !== today);
    filtered.push({ date: today, mood: index });
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = filtered.filter(e => new Date(e.date) >= thirtyDaysAgo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    setTodayMood(index);
  };

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();
  const weekDays = [...Array(7)].map((_, i) => {
    const dayIndex = (today - 6 + i + 7) % 7;
    return days[dayIndex];
  });

  return (
    <Card className="widget-card p-4">
      <h3 className="font-medium text-sm mb-3">How are you feeling?</h3>
      
      <div className="flex justify-between mb-4">
        {MOODS.map((mood, index) => (
          <button
            key={index}
            onClick={() => selectMood(index)}
            className={`p-2 rounded-xl transition-all ${
              todayMood === index
                ? `bg-gradient-to-br ${mood.color} scale-110 shadow-lg`
                : 'hover:bg-secondary/50'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-3 border-t border-border/50">
        {weekDays.map((day, index) => {
          const moodIndex = weekMoods[index];
          const mood = moodIndex !== null && moodIndex >= 0 && moodIndex < MOODS.length 
            ? MOODS[moodIndex] 
            : null;
          return (
            <div key={index} className="text-center">
              <span className="text-xs text-muted-foreground">{day}</span>
              <div className="mt-1 text-lg">
                {mood ? mood.emoji : '·'}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
