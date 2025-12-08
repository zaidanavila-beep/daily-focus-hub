import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Check } from 'lucide-react';

const STORAGE_KEY = 'daily-planner-notes';

export const NotesPad = () => {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, notes);
  }, [notes]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setNotes('');
  };

  return (
    <div className="space-y-3">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Quick notes, ideas, reminders..."
        className="min-h-[200px] resize-none"
      />
      
      <div className="flex gap-2">
        <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button onClick={handleClear} variant="outline" className="gap-2">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {notes.length} characters • Auto-saved
      </p>
    </div>
  );
};
