import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UpcomingTasksProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const UpcomingTasks = ({ tasks, onTaskClick }: UpcomingTasksProps) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const upcomingTasks = tasks
    .filter(task => {
      if (task.completed) return false;
      const [hours, minutes] = task.startTime.split(':').map(Number);
      const taskMinutes = hours * 60 + minutes;
      return taskMinutes > currentMinutes;
    })
    .sort((a, b) => {
      const [aH, aM] = a.startTime.split(':').map(Number);
      const [bH, bM] = b.startTime.split(':').map(Number);
      return (aH * 60 + aM) - (bH * 60 + bM);
    })
    .slice(0, 4);

  const getTimeUntil = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const taskMinutes = hours * 60 + minutes;
    const diff = taskMinutes - currentMinutes;
    
    if (diff < 60) return `in ${diff}m`;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return m > 0 ? `in ${h}h ${m}m` : `in ${h}h`;
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const completedToday = tasks.filter(t => t.completed).length;
  const pendingToday = tasks.filter(t => !t.completed).length;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">Upcoming</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            {completedToday} done
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            {pendingToday} left
          </span>
        </div>
      </div>

      {upcomingTasks.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No upcoming tasks</p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcomingTasks.map((task, index) => (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors ${
                index === 0 ? 'bg-primary/5 border border-primary/20' : ''
              }`}
            >
              <div className={`w-2 h-2 rounded-full category-${task.category}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground">{formatTime(task.startTime)}</p>
              </div>
              <span className={`text-xs font-medium ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                {getTimeUntil(task.startTime)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
