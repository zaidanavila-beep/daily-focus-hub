import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { TimeSlot } from './TimeSlot';

interface DailyTimelineProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (hour: number) => void;
}

export const DailyTimeline = ({
  tasks,
  onTaskClick,
  onAddTask,
}: DailyTimelineProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Generate hours from 6 AM to 11 PM
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  const getTasksForHour = (hour: number): Task[] => {
    return tasks.filter((task) => {
      const taskHour = parseInt(task.startTime.split(':')[0], 10);
      return taskHour === hour;
    });
  };

  return (
    <div className="space-y-0 animate-slide-up">
      {hours.map((hour, index) => (
        <TimeSlot
          key={hour}
          hour={hour}
          tasks={getTasksForHour(hour)}
          onTaskClick={onTaskClick}
          onAddTask={onAddTask}
          isCurrentHour={currentHour === hour}
          currentMinute={currentMinute}
        />
      ))}
    </div>
  );
};
