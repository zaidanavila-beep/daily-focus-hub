import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Palette, RotateCcw } from 'lucide-react';
import { ThemeColors } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemePickerProps {
  theme: ThemeColors;
  presets: { name: string; colors: ThemeColors }[];
  onPresetSelect: (name: string) => void;
  onColorChange: (colors: Partial<ThemeColors>) => void;
  onReset: () => void;
}

export const ThemePicker = ({
  theme,
  presets,
  onPresetSelect,
  onColorChange,
  onReset,
}: ThemePickerProps) => {
  const getHue = (hsl: string) => parseInt(hsl.split(' ')[0]) || 0;
  const getSaturation = (hsl: string) => parseInt(hsl.split(' ')[1]) || 0;
  const getLightness = (hsl: string) => parseInt(hsl.split(' ')[2]) || 0;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">Theme</span>
        </div>
        <Button size="icon" variant="ghost" onClick={onReset} className="h-8 w-8">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Preset themes */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((preset) => {
          const isActive = 
            preset.colors.primary === theme.primary && 
            preset.colors.accent === theme.accent;
          return (
            <button
              key={preset.name}
              onClick={() => onPresetSelect(preset.name)}
              className={cn(
                'group relative aspect-square rounded-xl overflow-hidden transition-all duration-300',
                isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-95' : 'hover:scale-105'
              )}
              title={preset.name}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, hsl(${preset.colors.primary}) 0%, hsl(${preset.colors.accent}) 100%)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3"
                style={{
                  background: `hsl(${preset.colors.background})`,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Custom color sliders */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Primary Color</span>
            <div
              className="w-6 h-6 rounded-full shadow-sm"
              style={{ background: `hsl(${theme.primary})` }}
            />
          </div>
          <Slider
            value={[getHue(theme.primary)]}
            onValueChange={([val]) => {
              const [, sat, light] = theme.primary.split(' ');
              onColorChange({ primary: `${val} ${sat} ${light}` });
            }}
            max={360}
            step={1}
            className="w-full"
            style={{
              background: 'linear-gradient(to right, hsl(0 80% 55%), hsl(60 80% 55%), hsl(120 80% 55%), hsl(180 80% 55%), hsl(240 80% 55%), hsl(300 80% 55%), hsl(360 80% 55%))',
              borderRadius: '9999px',
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Accent Color</span>
            <div
              className="w-6 h-6 rounded-full shadow-sm"
              style={{ background: `hsl(${theme.accent})` }}
            />
          </div>
          <Slider
            value={[getHue(theme.accent)]}
            onValueChange={([val]) => {
              const [, sat, light] = theme.accent.split(' ');
              onColorChange({ accent: `${val} ${sat} ${light}` });
            }}
            max={360}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Background Brightness</span>
          </div>
          <Slider
            value={[getLightness(theme.background)]}
            onValueChange={([val]) => {
              const [hue, sat] = theme.background.split(' ');
              onColorChange({ background: `${hue} ${sat} ${val}%` });
            }}
            min={5}
            max={98}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};
