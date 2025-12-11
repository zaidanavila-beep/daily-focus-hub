import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Task, CategoryType, CATEGORIES } from '@/types/task';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultTime?: { hour: number; minute: number };
  onSave: (task: Omit<Task, 'id'>) => void;
  onUpdate: (id: string, task: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskDialog = ({
  open,
  onOpenChange,
  task,
  defaultTime,
  onSave,
  onUpdate,
  onDelete,
  onToggleComplete,
}: TaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<CategoryType>('work');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStartTime(task.startTime);
      setEndTime(task.endTime);
      setCategory(task.category);
    } else {
      setTitle('');
      setDescription('');
      const hour = defaultTime?.hour ?? 9;
      const minute = defaultTime?.minute ?? 0;
      setStartTime(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      // End time is 1 hour after start
      const endHour = hour + 1;
      setEndTime(`${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      setCategory('work');
    }
  }, [task, defaultTime, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (task) {
      onUpdate(task.id, {
        title,
        description,
        startTime,
        endTime,
        category,
      });
    } else {
      onSave({
        title,
        description,
        startTime,
        endTime,
        category,
        completed: false,
        date: new Date().toDateString(),
      });
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {task ? 'Edit Task' : 'New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="h-11"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    `category-${cat.id}`,
                    category === cat.id
                      ? 'ring-2 ring-offset-2 ring-foreground/20'
                      : 'opacity-70 hover:opacity-100'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {task && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onToggleComplete(task.id);
                    onOpenChange(false);
                  }}
                  className="flex-1"
                >
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button type="submit" className="flex-1">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
