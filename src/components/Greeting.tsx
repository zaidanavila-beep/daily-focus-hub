import { format } from 'date-fns';

interface GreetingProps {
  date: Date;
}

export const Greeting = ({ date }: GreetingProps) => {
  const hour = date.getHours();
  
  let greeting = 'Good evening';
  let emoji = '🌙';
  
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
    emoji = '☀️';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    emoji = '🌤️';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening';
    emoji = '🌅';
  }

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-lg font-medium text-muted-foreground">{greeting}</h2>
      </div>
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mt-2 gradient-text">
        {format(date, 'EEEE')}
      </h1>
      <p className="text-xl text-muted-foreground mt-1">
        {format(date, 'MMMM d, yyyy')}
      </p>
    </div>
  );
};
