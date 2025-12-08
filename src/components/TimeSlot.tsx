import { Task } from '@/types/task';
import { TaskBlock } from './TaskBlock';
import { Plus } from 'lucide-react';

interface TimeSlotProps {
  hour: number;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (hour: number) => void;
  isCurrentHour: boolean;
  currentMinute: number;
}

export const TimeSlot = ({
  hour,
  tasks,
  onTaskClick,
  onAddTask,
  isCurrentHour,
  currentMinute,
}: TimeSlotProps) => {
  const formatHour = (h: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return { hour: displayHour, period };
  };

  const { hour: displayHour, period } = formatHour(hour);

  return (
    <div className={`time-slot group relative flex ${isCurrentHour ? 'bg-primary/5 rounded-xl -mx-2 px-2' : ''}`}>
      {/* Time label */}
      <div className="w-20 flex-shrink-0 pr-4 pt-3 text-right">
        <div className="flex items-baseline justify-end gap-1">
          <span className={`text-xl font-medium tabular-nums ${isCurrentHour ? 'text-primary' : 'text-foreground'}`}>
            {displayHour}
          </span>
          <span className={`text-xs font-medium ${isCurrentHour ? 'text-primary/70' : 'text-muted-foreground'}`}>
            {period}
          </span>
        </div>
      </div>

      {/* Slot content */}
      <div
        className="flex-1 min-h-[70px] relative border-l-2 border-border/30 pl-4 hover:border-primary/30 transition-colors cursor-pointer group"
        onClick={() => onAddTask(hour)}
      >
        {/* Current time indicator */}
        {isCurrentHour && (
          <div
            className="current-time-line"
            style={{ top: `${(currentMinute / 60) * 100}%` }}
          >
            <div className="current-time-dot" />
          </div>
        )}

        {/* Tasks for this hour */}
        <div className="space-y-2 py-2">
          {tasks.map((task) => (
            <TaskBlock
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>

        {/* Add task hint */}
        {tasks.length === 0 && (
          <div className="absolute inset-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-primary" />
              </div>
              <span>Add task</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
