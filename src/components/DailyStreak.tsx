import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Flame, Trophy, Zap } from 'lucide-react';

const STORAGE_KEY = 'daily-streak';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string;
  totalDays: number;
}

export const DailyStreak = () => {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisit: '',
    totalDays: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    
    if (stored) {
      const data: StreakData = JSON.parse(stored);
      const lastVisit = new Date(data.lastVisit);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastVisit.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (data.lastVisit === today) {
        // Already visited today
        setStreak(data);
      } else if (diffDays === 1) {
        // Consecutive day - increase streak
        const newStreak = {
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastVisit: today,
          totalDays: data.totalDays + 1,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreak));
        setStreak(newStreak);
      } else {
        // Streak broken - reset
        const newStreak = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastVisit: today,
          totalDays: data.totalDays + 1,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreak));
        setStreak(newStreak);
      }
    } else {
      // First visit
      const newStreak = {
        currentStreak: 1,
        longestStreak: 1,
        lastVisit: today,
        totalDays: 1,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreak));
      setStreak(newStreak);
    }
  }, []);

  const getStreakMessage = () => {
    if (streak.currentStreak >= 30) return "Unstoppable! 🔥";
    if (streak.currentStreak >= 14) return "On fire! 🚀";
    if (streak.currentStreak >= 7) return "Great week! ⭐";
    if (streak.currentStreak >= 3) return "Building momentum! 💪";
    return "Keep going! 🌱";
  };

  return (
    <Card className="p-4 transition-all duration-500">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          streak.currentStreak >= 7 
            ? 'bg-gradient-to-br from-orange-500 to-red-500 animate-pulse' 
            : 'bg-gradient-to-br from-orange-400 to-amber-500'
        }`}>
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{streak.currentStreak}</span>
            <span className="text-sm text-muted-foreground">day streak</span>
          </div>
          <p className="text-xs text-muted-foreground">{getStreakMessage()}</p>
        </div>
      </div>

      <div className="flex justify-between mt-4 pt-3 border-t">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <div>
            <p className="text-xs text-muted-foreground">Best</p>
            <p className="text-sm font-medium">{streak.longestStreak} days</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-medium">{streak.totalDays} days</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
