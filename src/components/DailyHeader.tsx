import { format } from 'date-fns';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyHeaderProps {
  date: Date;
  taskCount: number;
  completedCount: number;
  onAddTask: () => void;
}

export const DailyHeader = ({
  date,
  taskCount,
  completedCount,
  onAddTask,
}: DailyHeaderProps) => {
  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wide">
              {format(date, 'EEEE')}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            {format(date, 'MMMM d')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {taskCount === 0 ? (
              'No tasks scheduled'
            ) : (
              <>
                {completedCount} of {taskCount} tasks completed
              </>
            )}
          </p>
        </div>

        <Button onClick={onAddTask} size="lg" className="gap-2 shadow-soft">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Task</span>
        </Button>
      </div>

      {/* Progress bar */}
      {taskCount > 0 && (
        <div className="mt-6 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / taskCount) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
};
