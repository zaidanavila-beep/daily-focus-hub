import { useState, useEffect } from 'react';
import { CategoryType } from '@/types/task';

export interface CustomColors {
  work: string;
  personal: string;
  health: string;
  creative: string;
  meeting: string;
  break: string;
}

const DEFAULT_COLORS: CustomColors = {
  work: '#3b82f6',
  personal: '#ec4899',
  health: '#22c55e',
  creative: '#8b5cf6',
  meeting: '#f59e0b',
  break: '#06b6d4',
};

const STORAGE_KEY = 'daily-planner-colors';

export const useCustomColors = () => {
  const [colors, setColors] = useState<CustomColors>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_COLORS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    
    // Update CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      const hsl = hexToHSL(value);
      document.documentElement.style.setProperty(`--category-${key}`, hsl);
    });
  }, [colors]);

  const updateColor = (category: CategoryType, color: string) => {
    setColors((prev) => ({ ...prev, [category]: color }));
  };

  const resetColors = () => {
    setColors(DEFAULT_COLORS);
  };

  return { colors, updateColor, resetColors };
};

// Convert hex to HSL string
function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
