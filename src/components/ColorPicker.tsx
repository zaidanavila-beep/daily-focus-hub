import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [tempColor, setTempColor] = useState(color);

  const presetColors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between gap-2 h-11">
          <span className="text-sm">{label}</span>
          <div
            className="w-6 h-6 rounded-full border-2 border-border"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-4">
          {/* Color wheel input */}
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={tempColor}
              onChange={(e) => {
                setTempColor(e.target.value);
                onChange(e.target.value);
              }}
              className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
            />
            <Input
              value={tempColor}
              onChange={(e) => {
                setTempColor(e.target.value);
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                  onChange(e.target.value);
                }
              }}
              placeholder="#000000"
              className="font-mono text-sm"
            />
          </div>

          {/* Preset colors */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Presets</p>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((preset) => (
                <button
                  key={preset}
                  className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-foreground/20 transition-colors"
                  style={{ backgroundColor: preset }}
                  onClick={() => {
                    setTempColor(preset);
                    onChange(preset);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
