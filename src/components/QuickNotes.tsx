import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Save, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'quick-notes';

export const QuickNotes = () => {
  const [note, setNote] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, note);
      setSaved(true);
    }, 500);
    setSaved(false);
    return () => clearTimeout(timeout);
  }, [note]);

  const clearNote = () => {
    setNote('');
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">Quick Notes</h3>
        </div>
        <div className="flex items-center gap-1">
          {!saved && <Save className="w-3 h-3 text-muted-foreground animate-pulse" />}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearNote}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot down quick thoughts..."
        className="min-h-[100px] resize-none bg-secondary/30 border-0 focus-visible:ring-1"
      />
    </Card>
  );
};
