import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Calendar, Clock, CheckCircle } from 'lucide-react';

interface ProductivityInsightsProps {
  tasks: Task[];
}

export const ProductivityInsights = ({ tasks }: ProductivityInsightsProps) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate total scheduled hours
  const totalMinutes = tasks.reduce((acc, task) => {
    const [startH, startM] = task.startTime.split(':').map(Number);
    const [endH, endM] = task.endTime.split(':').map(Number);
    return acc + ((endH * 60 + endM) - (startH * 60 + startM));
  }, 0);
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

  // Get most productive category
  const categoryCount = tasks.reduce((acc, task) => {
    if (task.completed) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

  const getTrend = () => {
    if (completionRate >= 75) return { icon: TrendingUp, text: 'Great progress!', color: 'text-green-500' };
    if (completionRate >= 50) return { icon: Minus, text: 'On track', color: 'text-yellow-500' };
    return { icon: TrendingDown, text: 'Keep pushing!', color: 'text-orange-500' };
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  return (
    <Card className="p-4">
      <h3 className="font-medium text-sm mb-3">Today's Insights</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-xs">Completion</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{completionRate}%</span>
            <TrendIcon className={`w-4 h-4 ${trend.color}`} />
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs">Scheduled</span>
          </div>
          <span className="text-sm font-bold">{totalHours}h</span>
        </div>

        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs">Top Category</span>
          </div>
          <span className="text-sm font-bold capitalize">
            {topCategory ? topCategory[0] : 'N/A'}
          </span>
        </div>
      </div>

      <p className={`text-xs text-center mt-3 ${trend.color}`}>
        {trend.text}
      </p>
    </Card>
  );
};
