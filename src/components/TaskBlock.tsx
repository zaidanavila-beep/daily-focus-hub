import { Task } from '@/types/task';
import { Check } from 'lucide-react';
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
      <div className="flex items-start gap-2">
        {task.completed && (
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
            <Check className="w-3 h-3 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              'font-medium text-sm text-foreground truncate',
              task.completed && 'line-through'
            )}
          >
            {task.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {task.startTime} - {task.endTime}
          </p>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
