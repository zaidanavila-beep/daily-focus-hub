import { Plus, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiveClock } from './LiveClock';
import { WeatherWidget } from './WeatherWidget';
import { Greeting } from './Greeting';
import { QuickStats } from './QuickStats';
import { Task } from '@/types/task';

interface DailyHeaderProps {
  date: Date;
  tasks: Task[];
  onAddTask: () => void;
  onOpenSettings: () => void;
}

export const DailyHeader = ({
  date,
  tasks,
  onAddTask,
  onOpenSettings
}: DailyHeaderProps) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const taskCount = tasks.length;

  return (
    <header className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-colored">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">DayFlow</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={onOpenSettings} className="rounded-xl">
            <Settings className="w-5 h-5" />
          </Button>
          <Button onClick={onAddTask} className="gap-2 rounded-xl shadow-colored">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <Greeting date={date} />
          <div className="widget-card">
            <LiveClock />
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <WeatherWidget />
        </div>
      </div>

      <QuickStats tasks={tasks} />

      {taskCount > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium">{completedCount}/{taskCount} completed</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out gradient-bg"
              style={{ width: `${completedCount / taskCount * 100}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
