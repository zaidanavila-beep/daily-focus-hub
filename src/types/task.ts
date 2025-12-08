export type CategoryType = 'work' | 'personal' | 'health' | 'creative' | 'meeting' | 'break';

export interface Task {
  id: string;
  title: string;
  description?: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  category: CategoryType;
  completed: boolean;
}

export interface Category {
  id: CategoryType;
  name: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: 'category-work' },
  { id: 'personal', name: 'Personal', color: 'category-personal' },
  { id: 'health', name: 'Health', color: 'category-health' },
  { id: 'creative', name: 'Creative', color: 'category-creative' },
  { id: 'meeting', name: 'Meeting', color: 'category-meeting' },
  { id: 'break', name: 'Break', color: 'category-break' },
];
