import { Task } from '@/types/task';
import { CheckCircle2, Clock, Target, Zap } from 'lucide-react';

interface QuickStatsProps {
  tasks: Task[];
}

export const QuickStats = ({ tasks }: QuickStatsProps) => {
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate total scheduled hours
  const totalMinutes = tasks.reduce((acc, task) => {
    const [startH, startM] = task.startTime.split(':').map(Number);
    const [endH, endM] = task.endTime.split(':').map(Number);
    return acc + (endH * 60 + endM) - (startH * 60 + startM);
  }, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Get upcoming task
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const upcomingTask = tasks
    .filter((t) => !t.completed)
    .find((task) => {
      const [h, m] = task.startTime.split(':').map(Number);
      return h * 60 + m > currentMinutes;
    });

  const stats = [
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: `${completedTasks}/${totalTasks}`,
      color: 'text-category-health',
      bgColor: 'bg-category-health/10',
    },
    {
      icon: Target,
      label: 'Progress',
      value: `${completionRate}%`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Clock,
      label: 'Scheduled',
      value: `${totalHours}h`,
      color: 'text-category-meeting',
      bgColor: 'bg-category-meeting/10',
    },
    {
      icon: Zap,
      label: 'Next Up',
      value: upcomingTask ? upcomingTask.title.slice(0, 12) + (upcomingTask.title.length > 12 ? '...' : '') : 'Free!',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
          <p className="text-lg font-semibold mt-0.5 truncate">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
