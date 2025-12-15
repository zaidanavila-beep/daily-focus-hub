import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VirtualPet } from '@/components/VirtualPet';
import { useTasks } from '@/hooks/useTasks';
import { usePet } from '@/hooks/usePet';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';

const HomePage = () => {
  const { tasks } = useTasks();
  const { pet } = usePet();

  const completedToday = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;
  const totalHours = tasks.reduce((acc, t) => {
    const [startH, startM] = t.startTime.split(':').map(Number);
    const [endH, endM] = t.endTime.split(':').map(Number);
    const duration = (endH * 60 + endM) - (startH * 60 + startM);
    return acc + (duration > 0 ? duration : 60) / 60;
  }, 0).toFixed(1);

  // Get streak from localStorage
  const streakData = localStorage.getItem('daily-streak');
  const streak = streakData ? JSON.parse(streakData).streak || 0 : 0;

  const stats = [
    { icon: CheckCircle2, label: 'Completed', value: completedToday, color: 'text-green-500' },
    { icon: Target, label: 'Tasks Today', value: totalTasks, color: 'text-blue-500' },
    { icon: Clock, label: 'Hours Planned', value: totalHours, color: 'text-purple-500' },
    { icon: Flame, label: 'Day Streak', value: streak, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background mesh-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shadow-colored">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome to DayFlow</h1>
          <p className="text-muted-foreground">Your daily productivity companion</p>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Pet */}
          <div className="space-y-6">
            <VirtualPet />

            {/* Pet Info Card */}
            <Card className="widget-card p-4 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your companion</p>
                  <p className="text-2xl font-bold">{pet.name}</p>
                </div>
                <div className="text-5xl">{pet.type}</div>
              </div>
            </Card>
          </div>

          {/* Right: Stats & CTA */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card 
                  key={stat.label} 
                  className="widget-card p-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-secondary/50 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Progress Ring */}
            <Card className="widget-card p-6 text-center">
              <h3 className="font-medium mb-4">Today's Progress</h3>
              <div className="relative inline-block mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-secondary"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${completionRate * 3.52} 352`}
                    className="text-primary transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{completionRate}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {completedToday} of {totalTasks} tasks completed
              </p>
            </Card>

            {/* CTA */}
            <Link to="/planner">
              <Button className="w-full h-14 text-lg gap-2 rounded-xl shadow-colored">
                <Calendar className="w-5 h-5" />
                Go to Daily Planner
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;