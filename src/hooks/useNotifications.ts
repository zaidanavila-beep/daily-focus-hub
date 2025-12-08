import { useEffect, useCallback, useRef } from 'react';
import { Task } from '@/types/task';
import { toast } from '@/hooks/use-toast';

export const useNotifications = (tasks: Task[]) => {
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Notifications not supported',
        description: 'Your browser does not support notifications.',
        variant: 'destructive',
      });
      return false;
    }

    if (Notification.permission === 'granted') return true;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast({
        title: 'Notifications enabled',
        description: 'You will receive reminders for your tasks.',
      });
      return true;
    }

    toast({
      title: 'Notifications blocked',
      description: 'Please enable notifications in your browser settings.',
      variant: 'destructive',
    });
    return false;
  }, []);

  const sendNotification = useCallback((task: Task) => {
    if (Notification.permission !== 'granted') return;

    const notification = new Notification(`Reminder: ${task.title}`, {
      body: `Starting at ${task.startTime}${task.description ? `\n${task.description}` : ''}`,
      icon: '/favicon.ico',
      tag: task.id,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }, []);

  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      tasks.forEach((task) => {
        if (task.completed) return;
        if (notifiedTasksRef.current.has(task.id)) return;

        // Notify 5 minutes before
        const [taskHour, taskMin] = task.startTime.split(':').map(Number);
        const taskDate = new Date();
        taskDate.setHours(taskHour, taskMin, 0, 0);
        
        const diff = (taskDate.getTime() - now.getTime()) / (1000 * 60);
        
        if (diff <= 5 && diff > 0) {
          sendNotification(task);
          notifiedTasksRef.current.add(task.id);
        }
      });
    };

    const interval = setInterval(checkTasks, 30000); // Check every 30 seconds
    checkTasks(); // Initial check

    return () => clearInterval(interval);
  }, [tasks, sendNotification]);

  // Reset notified tasks at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeout = setTimeout(() => {
      notifiedTasksRef.current.clear();
    }, tomorrow.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, []);

  return { requestPermission };
};
