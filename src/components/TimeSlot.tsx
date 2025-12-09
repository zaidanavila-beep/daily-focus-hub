import { Task } from '@/types/task';
import { TaskBlock } from './TaskBlock';
import { Plus } from 'lucide-react';

interface TimeSlotProps {
  hour: number;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (hour: number, minute?: number) => void;
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

  // Sort tasks by start time (including minutes)
  const sortedTasks = [...tasks].sort((a, b) => {
    const [, aMin] = a.startTime.split(':').map(Number);
    const [, bMin] = b.startTime.split(':').map(Number);
    return aMin - bMin;
  });

  const handleSlotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Calculate which minute segment was clicked (0, 15, 30, 45)
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = y / rect.height;
    const minuteSegment = Math.floor(percentage * 4) * 15;
    onAddTask(hour, minuteSegment);
  };

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
        {/* Minute markers */}
        <div className="flex justify-end gap-1 mt-1">
          {[0, 15, 30, 45].map((min) => (
            <div
              key={min}
              className={`w-1 h-1 rounded-full ${
                isCurrentHour && currentMinute >= min && currentMinute < min + 15
                  ? 'bg-primary'
                  : 'bg-border/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slot content */}
      <div
        className="flex-1 min-h-[80px] relative border-l-2 border-border/30 pl-4 hover:border-primary/30 transition-colors cursor-pointer group"
        onClick={handleSlotClick}
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

        {/* Quarter-hour markers */}
        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 border-t border-border/20 first:border-t-0"
            />
          ))}
        </div>

        {/* Tasks for this hour */}
        <div className="space-y-2 py-2 ml-2">
          {sortedTasks.map((task) => (
            <TaskBlock
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>

        {/* Add task hint */}
        {tasks.length === 0 && (
          <div className="absolute inset-0 flex items-center pl-6 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-primary" />
              </div>
              <span>Click to add task</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
