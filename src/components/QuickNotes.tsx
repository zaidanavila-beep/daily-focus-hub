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
    <Card className="p-4 transition-all duration-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <StickyNote className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-sm">Quick Notes</span>
        </div>
        <div className="flex items-center gap-1">
          {saved ? (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <Save className="w-3 h-3" /> Saved
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Saving...</span>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={clearNote}
            className="h-7 w-7"
            disabled={!note}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Textarea
        placeholder="Jot down quick thoughts, reminders, or ideas..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[100px] resize-none text-sm"
      />

      <p className="text-[10px] text-muted-foreground mt-2 text-right">
        {note.length} characters
      </p>
    </Card>
  );
};
