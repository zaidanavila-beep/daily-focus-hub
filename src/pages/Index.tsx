import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DailyHeader } from '@/components/DailyHeader';
import { DailyTimeline } from '@/components/DailyTimeline';
import { TaskDialog } from '@/components/TaskDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { ToolsMenu } from '@/components/ToolsMenu';
import { QuoteWidget } from '@/components/QuoteWidget';
import { DailyFocus } from '@/components/DailyFocus';
import { MiniCalendar } from '@/components/MiniCalendar';
import { UpcomingTasks } from '@/components/UpcomingTasks';
import { ThemePicker } from '@/components/ThemePicker';
import { ProductivityInsights } from '@/components/ProductivityInsights';
import { MoodTracker } from '@/components/MoodTracker';
import { DailyStreak } from '@/components/DailyStreak';
import { BreathingExercise } from '@/components/BreathingExercise';
import { MiniGames } from '@/components/MiniGames';
import { FocusTimer } from '@/components/FocusTimer';
import { DiceRoller } from '@/components/DiceRoller';
import { ReactionGame } from '@/components/ReactionGame';
import { CookieClicker } from '@/components/CookieClicker';
import { WordScramble } from '@/components/WordScramble';
import { CountdownTimer } from '@/components/widgets/CountdownTimer';
import { TriviaQuiz } from '@/components/widgets/TriviaQuiz';
import { TypingSpeed } from '@/components/widgets/TypingSpeed';
import { ColorMatch } from '@/components/widgets/ColorMatch';
import { MathChallenge } from '@/components/widgets/MathChallenge';
import { EmojiCatch } from '@/components/widgets/EmojiCatch';
import { PatternMemory } from '@/components/widgets/PatternMemory';
import { QuickPoll } from '@/components/widgets/QuickPoll';
import { DailyChallenge } from '@/components/widgets/DailyChallenge';
import { LuckyWheel } from '@/components/widgets/LuckyWheel';
import { useTasks } from '@/hooks/useTasks';
import { useCustomColors } from '@/hooks/useCustomColors';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const { colors, updateColor, resetColors } = useCustomColors();
  const { requestPermission } = useNotifications(tasks);
  const { theme, updateTheme, setPreset, resetTheme, presets } = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultTime, setDefaultTime] = useState<{ hour: number; minute: number } | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const today = new Date();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDefaultTime(undefined);
    setDialogOpen(true);
  };

  const handleAddTask = (hour?: number, minute?: number) => {
    setSelectedTask(null);
    if (hour !== undefined) {
      setDefaultTime({ hour, minute: minute ?? 0 });
    } else {
      setDefaultTime(undefined);
    }
    setDialogOpen(true);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    setNotificationsEnabled(granted);
  };

  const handleToggleComplete = (taskId: string) => {
    toggleComplete(taskId);
  };

  return (
    <div className="min-h-screen bg-background mesh-background transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto px-4 py-6 md:py-8">
        {/* Home Link */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </Link>

        <DailyHeader
          date={today}
          tasks={tasks}
          onAddTask={() => handleAddTask()}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* Top widgets row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
          <DailyFocus />
          <QuoteWidget />
          <FocusTimer />
          <DiceRoller />
          <LuckyWheel />
          <DailyChallenge />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-12 gap-2">
          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-2 order-2 lg:order-1">
            <UpcomingTasks tasks={tasks} onTaskClick={handleTaskClick} />
            <MiniCalendar />
            <DailyStreak />
            <TriviaQuiz />
            <MiniGames />
            <WordScramble />
            <EmojiCatch />
          </div>

          {/* Center: Main schedule */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <main className="widget-card p-4 md:p-6 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl">Today's Schedule</h2>
                <span className="text-sm text-muted-foreground">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
              <DailyTimeline
                tasks={tasks}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTask}
              />
            </main>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-3 space-y-2 order-3">
            <ThemePicker
              theme={theme}
              presets={presets}
              onPresetSelect={setPreset}
              onColorChange={updateTheme}
              onReset={resetTheme}
            />
            <ProductivityInsights tasks={tasks} />
            <ReactionGame />
            <CookieClicker />
            <MathChallenge />
            <TypingSpeed />
            <ColorMatch />
            <PatternMemory />
          </div>
        </div>

        {/* Bottom widgets row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          <MoodTracker />
          <BreathingExercise />
          <CountdownTimer />
          <QuickPoll />
        </div>

        <footer className="mt-6 text-center text-xs text-muted-foreground transition-colors duration-500">
          Click on any time slot to add a task • Tasks auto-clear at midnight • Complete tasks to earn XP!
        </footer>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        defaultTime={defaultTime}
        onSave={addTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onToggleComplete={handleToggleComplete}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        colors={colors}
        onColorChange={updateColor}
        onResetColors={resetColors}
        notificationsEnabled={notificationsEnabled}
        onEnableNotifications={handleEnableNotifications}
      />

      <ToolsMenu />
    </div>
  );
};

export default Index;