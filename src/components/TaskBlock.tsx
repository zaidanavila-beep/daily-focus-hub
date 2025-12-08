import { Task } from '@/types/task';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskBlockProps {
  task: Task;
  onClick: () => void;
}

export const TaskBlock = ({ task, onClick }: TaskBlockProps) => {
  return (
    <div
      className={cn(
        'time-block animate-scale-in',
        `category-${task.category}`,
        task.completed && 'opacity-60'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 transition-colors',
            task.completed
              ? 'bg-primary/20'
              : 'bg-background/50 border border-border'
          )}
        >
          {task.completed && <Check className="w-3.5 h-3.5 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              'font-medium text-sm text-foreground',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {task.startTime} - {task.endTime}
            </p>
          </div>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
