import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Delete } from 'lucide-react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldResetDisplay(true);
  };

  const handleEqual = () => {
    try {
      const fullEquation = equation + display;
      // Safe eval using Function constructor
      const result = new Function('return ' + fullEquation.replace(/×/g, '*').replace(/÷/g, '/'))();
      setDisplay(String(parseFloat(result.toFixed(10))));
      setEquation('');
      setShouldResetDisplay(true);
    } catch {
      setDisplay('Error');
      setEquation('');
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
  ];

  return (
    <div className="space-y-3">
      {/* Display */}
      <div className="bg-secondary rounded-xl p-4">
        <p className="text-xs text-muted-foreground h-4 text-right">{equation}</p>
        <p className="text-3xl font-medium text-right truncate">{display}</p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((btn) => (
          <Button
            key={btn}
            variant={['÷', '×', '-', '+', '='].includes(btn) ? 'default' : 'secondary'}
            className={`h-12 text-lg font-medium ${btn === '0' ? '' : ''}`}
            onClick={() => {
              if (btn === 'C') handleClear();
              else if (btn === '⌫') handleBackspace();
              else if (btn === '±') setDisplay(String(-parseFloat(display)));
              else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
              else if (btn === '.') handleDecimal();
              else if (btn === '=') handleEqual();
              else if (['÷', '×', '-', '+'].includes(btn)) handleOperator(btn);
              else handleNumber(btn);
            }}
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  );
};
