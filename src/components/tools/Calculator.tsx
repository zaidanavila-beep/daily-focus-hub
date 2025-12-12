import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const SECRET_CODE = 'JimmySleepOver';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [showSecretInput, setShowSecretInput] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretUnlocked, setSecretUnlocked] = useState(false);

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
    // Check for secret trigger
    if (display === '67') {
      setShowSecretInput(true);
      setDisplay('0');
      return;
    }

    try {
      const fullEquation = equation + display;
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
    setShowSecretInput(false);
    setSecretInput('');
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

  const handleSecretSubmit = () => {
    if (secretInput === SECRET_CODE) {
      setSecretUnlocked(true);
      setShowSecretInput(false);
      toast.success('🎉 Secret unlocked! Welcome to the inner circle!');
    } else {
      toast.error('Wrong code! Try again.');
      setSecretInput('');
    }
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
  ];

  if (secretUnlocked) {
    return (
      <div className="space-y-4 text-center">
        <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl">
          <span className="text-6xl mb-4 block animate-bounce">🎊</span>
          <h3 className="text-xl font-bold mb-2">You found the secret!</h3>
          <p className="text-muted-foreground mb-4">
            Welcome to Jimmy's Sleepover Club!
          </p>
          <div className="space-y-2 text-sm">
            <p>🌟 You're now a VIP member</p>
            <p>🎮 +100 bonus XP for your pet!</p>
            <p>🏆 Secret achievement unlocked</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setSecretUnlocked(false)}>
          Back to Calculator
        </Button>
      </div>
    );
  }

  if (showSecretInput) {
    return (
      <div className="space-y-4">
        <div className="bg-secondary/50 rounded-2xl p-5 text-center">
          <span className="text-4xl mb-2 block">🔐</span>
          <p className="text-sm text-muted-foreground mb-4">Enter the secret code:</p>
          <Input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Type the code..."
            className="text-center mb-3"
            onKeyDown={(e) => e.key === 'Enter' && handleSecretSubmit()}
          />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleClear}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSecretSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-secondary/50 rounded-2xl p-5">
        <p className="text-xs text-muted-foreground h-5 text-right font-mono">{equation}</p>
        <p className="text-4xl font-light text-right truncate tabular-nums">{display}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((btn) => (
          <Button
            key={btn}
            variant={['÷', '×', '-', '+', '='].includes(btn) ? 'default' : 'secondary'}
            className={`h-14 text-lg font-medium rounded-xl ${btn === '=' ? 'gradient-bg' : ''}`}
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
