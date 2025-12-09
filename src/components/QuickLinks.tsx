import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Plus, Trash2, X } from 'lucide-react';

interface QuickLink {
  id: string;
  name: string;
  url: string;
}

const STORAGE_KEY = 'quick-links';

const DEFAULT_LINKS: QuickLink[] = [
  { id: '1', name: 'Google', url: 'https://google.com' },
  { id: '2', name: 'Wikipedia', url: 'https://wikipedia.org' },
  { id: '3', name: 'Khan Academy', url: 'https://khanacademy.org' },
];

export const QuickLinks = () => {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_LINKS;
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }, [links]);

  const addLink = () => {
    if (!newName.trim() || !newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setLinks(prev => [...prev, { id: crypto.randomUUID(), name: newName.trim(), url }]);
    setNewName('');
    setNewUrl('');
    setIsAdding(false);
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Quick Links</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsAdding(!isAdding)}
          className="h-7 w-7"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </Button>
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 h-9"
          />
          <Input
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1 h-9"
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
          />
          <Button size="sm" onClick={addLink} disabled={!newName.trim() || !newUrl.trim()}>
            Add
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {links.map(link => (
          <div
            key={link.id}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              {link.name}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
            <button
              onClick={() => deleteLink(link.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {links.length === 0 && (
          <p className="text-sm text-muted-foreground">No quick links yet</p>
        )}
      </div>
    </Card>
  );
};
