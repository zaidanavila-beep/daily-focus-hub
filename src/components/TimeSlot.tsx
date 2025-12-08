import { Task } from '@/types/task';
import { TaskBlock } from './TaskBlock';

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
    return `${displayHour} ${period}`;
  };

  return (
    <div className="time-slot group relative flex">
      {/* Time label */}
      <div className="w-20 flex-shrink-0 pr-4 pt-2 text-right">
        <span className="text-sm font-medium text-muted-foreground">
          {formatHour(hour)}
        </span>
      </div>

      {/* Slot content */}
      <div
        className="flex-1 min-h-[60px] relative border-l-2 border-border/30 pl-4 hover:bg-secondary/30 transition-colors cursor-pointer"
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
        <div className="space-y-2 py-1">
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
          <div className="absolute inset-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm text-muted-foreground">+ Add task</span>
          </div>
        )}
      </div>
    </div>
  );
};
