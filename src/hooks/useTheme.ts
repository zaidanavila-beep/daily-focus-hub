import { useState, useEffect } from 'react';

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
}

const STORAGE_KEY = 'theme-colors';

const DEFAULT_THEME: ThemeColors = {
  primary: '220 90% 56%',
  accent: '260 85% 60%',
  background: '220 20% 97%',
};

const PRESET_THEMES: { name: string; colors: ThemeColors }[] = [
  { name: 'Ocean Blue', colors: { primary: '220 90% 56%', accent: '260 85% 60%', background: '220 20% 97%' } },
  { name: 'Sunset', colors: { primary: '25 95% 55%', accent: '330 85% 60%', background: '30 30% 96%' } },
  { name: 'Forest', colors: { primary: '150 70% 40%', accent: '180 60% 45%', background: '150 20% 96%' } },
  { name: 'Berry', colors: { primary: '330 85% 55%', accent: '280 75% 55%', background: '330 20% 97%' } },
  { name: 'Midnight', colors: { primary: '250 80% 60%', accent: '280 85% 65%', background: '250 25% 10%' } },
  { name: 'Rose Gold', colors: { primary: '350 75% 60%', accent: '35 80% 55%', background: '30 25% 96%' } },
  { name: 'Lavender', colors: { primary: '270 70% 60%', accent: '300 60% 55%', background: '270 20% 97%' } },
  { name: 'Teal', colors: { primary: '175 80% 40%', accent: '200 70% 50%', background: '175 20% 96%' } },
  { name: 'Coral', colors: { primary: '15 85% 60%', accent: '350 75% 55%', background: '20 25% 97%' } },
  { name: 'Emerald', colors: { primary: '160 85% 40%', accent: '140 70% 45%', background: '160 15% 96%' } },
  { name: 'Golden', colors: { primary: '45 95% 50%', accent: '30 90% 55%', background: '45 30% 96%' } },
  { name: 'Night Sky', colors: { primary: '230 75% 55%', accent: '260 80% 60%', background: '230 25% 8%' } },
];

const applyTheme = (colors: ThemeColors) => {
  const root = document.documentElement;
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--ring', colors.primary);
  
  // Determine if dark mode based on background lightness
  const [, , lightness] = colors.background.split(' ').map(v => parseFloat(v));
  const isDark = lightness < 50;
  
  if (isDark) {
    root.classList.add('dark');
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', '220 15% 95%');
    root.style.setProperty('--card', `${colors.background.split(' ')[0]} 20% 12%`);
    root.style.setProperty('--card-foreground', '220 15% 95%');
    root.style.setProperty('--secondary', `${colors.background.split(' ')[0]} 15% 18%`);
    root.style.setProperty('--secondary-foreground', '220 15% 90%');
    root.style.setProperty('--muted', `${colors.background.split(' ')[0]} 15% 16%`);
    root.style.setProperty('--muted-foreground', '220 10% 55%');
    root.style.setProperty('--border', `${colors.background.split(' ')[0]} 15% 18%`);
  } else {
    root.classList.remove('dark');
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', '220 25% 10%');
    root.style.setProperty('--card', '0 0% 100%');
    root.style.setProperty('--card-foreground', '220 25% 10%');
    root.style.setProperty('--secondary', `${colors.background.split(' ')[0]} 15% 92%`);
    root.style.setProperty('--secondary-foreground', '220 25% 20%');
    root.style.setProperty('--muted', `${colors.background.split(' ')[0]} 15% 94%`);
    root.style.setProperty('--muted-foreground', '220 10% 45%');
    root.style.setProperty('--border', `${colors.background.split(' ')[0]} 15% 90%`);
  }
  
  // Update gradient
  root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${colors.primary}) 0%, hsl(${colors.accent}) 100%)`);
  root.style.setProperty('--shadow-colored', `0 8px 24px -4px hsl(${colors.primary} / 0.25)`);
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeColors>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_THEME;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (colors: Partial<ThemeColors>) => {
    setTheme(prev => ({ ...prev, ...colors }));
  };

  const setPreset = (presetName: string) => {
    const preset = PRESET_THEMES.find(p => p.name === presetName);
    if (preset) {
      setTheme(preset.colors);
    }
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
  };

  return {
    theme,
    updateTheme,
    setPreset,
    resetTheme,
    presets: PRESET_THEMES,
  };
};
