import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ConversionCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'time';

interface Unit {
  name: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const conversions: Record<ConversionCategory, Record<string, Unit>> = {
  length: {
    m: { name: 'Meters', toBase: v => v, fromBase: v => v },
    km: { name: 'Kilometers', toBase: v => v * 1000, fromBase: v => v / 1000 },
    cm: { name: 'Centimeters', toBase: v => v / 100, fromBase: v => v * 100 },
    mm: { name: 'Millimeters', toBase: v => v / 1000, fromBase: v => v * 1000 },
    mi: { name: 'Miles', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
    ft: { name: 'Feet', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    in: { name: 'Inches', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    yd: { name: 'Yards', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
  },
  weight: {
    kg: { name: 'Kilograms', toBase: v => v, fromBase: v => v },
    g: { name: 'Grams', toBase: v => v / 1000, fromBase: v => v * 1000 },
    mg: { name: 'Milligrams', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    lb: { name: 'Pounds', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    oz: { name: 'Ounces', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  },
  temperature: {
    c: { name: 'Celsius', toBase: v => v, fromBase: v => v },
    f: { name: 'Fahrenheit', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
    k: { name: 'Kelvin', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  },
  volume: {
    l: { name: 'Liters', toBase: v => v, fromBase: v => v },
    ml: { name: 'Milliliters', toBase: v => v / 1000, fromBase: v => v * 1000 },
    gal: { name: 'Gallons (US)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    qt: { name: 'Quarts', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    pt: { name: 'Pints', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
    cup: { name: 'Cups', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
  },
  time: {
    s: { name: 'Seconds', toBase: v => v, fromBase: v => v },
    min: { name: 'Minutes', toBase: v => v * 60, fromBase: v => v / 60 },
    h: { name: 'Hours', toBase: v => v * 3600, fromBase: v => v / 3600 },
    d: { name: 'Days', toBase: v => v * 86400, fromBase: v => v / 86400 },
    wk: { name: 'Weeks', toBase: v => v * 604800, fromBase: v => v / 604800 },
  },
};

const categoryLabels: Record<ConversionCategory, string> = {
  length: '📏 Length',
  weight: '⚖️ Weight',
  temperature: '🌡️ Temperature',
  volume: '🫗 Volume',
  time: '⏱️ Time',
};

export const UnitConverter = () => {
  const [category, setCategory] = useState<ConversionCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  const convert = (value: string, from: string, to: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    const units = conversions[category];
    const baseValue = units[from].toBase(numValue);
    const result = units[to].fromBase(baseValue);
    
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  const handleFromChange = (value: string) => {
    setFromValue(value);
    setToValue(convert(value, fromUnit, toUnit));
  };

  const handleToChange = (value: string) => {
    setToValue(value);
    setFromValue(convert(value, toUnit, fromUnit));
  };

  const handleCategoryChange = (newCategory: ConversionCategory) => {
    setCategory(newCategory);
    const units = Object.keys(conversions[newCategory]);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue('1');
    setToValue(convert('1', units[0], units[1]));
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const units = conversions[category];

  return (
    <div className="space-y-4">
      <Select value={category} onValueChange={(v) => handleCategoryChange(v as ConversionCategory)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-3">
        <div className="space-y-2">
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(units).map(([key, unit]) => (
                <SelectItem key={key} value={key}>{unit.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={fromValue}
            onChange={(e) => handleFromChange(e.target.value)}
            placeholder="Enter value"
            className="text-lg font-medium"
          />
        </div>

        <div className="flex justify-center">
          <Button size="icon" variant="ghost" onClick={swap}>
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(units).map(([key, unit]) => (
                <SelectItem key={key} value={key}>{unit.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={toValue}
            onChange={(e) => handleToChange(e.target.value)}
            placeholder="Result"
            className="text-lg font-medium bg-secondary/50"
          />
        </div>
      </div>
    </div>
  );
};
