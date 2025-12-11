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
  return;
};