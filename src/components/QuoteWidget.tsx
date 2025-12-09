import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
];

const STORAGE_KEY = 'daily-quote';

export const QuoteWidget = () => {
  const [quote, setQuote] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { quote, date } = JSON.parse(stored);
      const today = new Date().toDateString();
      if (date === today) return quote;
    }
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  });

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ quote, date: today }));
  }, [quote]);

  const getNewQuote = () => {
    let newQuote = quote;
    while (newQuote === quote) {
      newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }
    setQuote(newQuote);
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
      <div className="flex items-start gap-3">
        <Quote className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">"{quote.text}"</p>
          <p className="text-xs text-muted-foreground mt-2">— {quote.author}</p>
        </div>
        <Button size="icon" variant="ghost" onClick={getNewQuote} className="shrink-0 h-8 w-8">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
