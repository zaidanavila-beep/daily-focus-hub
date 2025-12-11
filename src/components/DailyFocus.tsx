import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Target, Check, Edit2 } from 'lucide-react';
const STORAGE_KEY = 'daily-focus-goal';
export const DailyFocus = () => {
  const [focus, setFocus] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const {
        text,
        date
      } = JSON.parse(stored);
      const today = new Date().toDateString();
      if (date === today) return text;
    }
    return '';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(focus);
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      text: focus,
      date: today
    }));
  }, [focus]);
  const handleSave = () => {
    setFocus(inputValue.trim());
    setIsEditing(false);
  };
  if (!focus && !isEditing) {
    return <Card className="p-4 border-dashed cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setIsEditing(true)}>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Target className="w-5 h-5" />
          <span className="text-sm">Set your main focus for today...</span>
        </div>
      </Card>;
  }
  if (isEditing) {
    return;
  }
  return <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">Today's Focus</p>
          <p className="font-medium truncate">{focus}</p>
        </div>
        <Button size="icon" variant="ghost" onClick={() => {
        setInputValue(focus);
        setIsEditing(true);
      }} className="shrink-0 h-8 w-8">
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>;
};