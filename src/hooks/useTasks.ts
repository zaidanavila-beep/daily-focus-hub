import { useState, useEffect } from 'react';
import { Task } from '@/types/task';

const STORAGE_KEY = 'daily-planner-tasks';
const LAST_CLEANUP_KEY = 'daily-planner-last-cleanup';

const getStoredTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const getTodayDateString = (): string => {
  return new Date().toDateString();
};

const cleanupOldTasks = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter out tasks from previous days
  return tasks.filter(task => {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() >= today.getTime();
  });
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = getStoredTasks();
    const lastCleanup = localStorage.getItem(LAST_CLEANUP_KEY);
    const today = getTodayDateString();
    
    // Check if we need to run cleanup (new day)
    if (lastCleanup !== today) {
      const cleanedTasks = cleanupOldTasks(storedTasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedTasks));
      localStorage.setItem(LAST_CLEANUP_KEY, today);
      return cleanedTasks;
    }
    
    return storedTasks;
  });

  // Check for midnight cleanup
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const lastCleanup = localStorage.getItem(LAST_CLEANUP_KEY);
      const today = getTodayDateString();
      
      if (lastCleanup !== today) {
        setTasks(prevTasks => {
          const cleanedTasks = cleanupOldTasks(prevTasks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedTasks));
          localStorage.setItem(LAST_CLEANUP_KEY, today);
          return cleanedTasks;
        });
      }
    };

    // Check immediately
    checkMidnight();
    
    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Set timeout for midnight
    const midnightTimeout = setTimeout(() => {
      checkMidnight();
      // Then check every minute after midnight
      const interval = setInterval(checkMidnight, 60000);
      return () => clearInterval(interval);
    }, timeUntilMidnight);

    // Also check every hour in case the app is left open
    const hourlyInterval = setInterval(checkMidnight, 3600000);

    return () => {
      clearTimeout(midnightTimeout);
      clearInterval(hourlyInterval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
};
