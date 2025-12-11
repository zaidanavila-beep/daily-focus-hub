import { useState } from 'react';
import { DailyHeader } from '@/components/DailyHeader';
import { DailyTimeline } from '@/components/DailyTimeline';
import { TaskDialog } from '@/components/TaskDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { ToolsMenu } from '@/components/ToolsMenu';
import { QuoteWidget } from '@/components/QuoteWidget';
import { DailyFocus } from '@/components/DailyFocus';
import { MiniCalendar } from '@/components/MiniCalendar';
import { UpcomingTasks } from '@/components/UpcomingTasks';
import { MusicPlayer } from '@/components/MusicPlayer';
import { ThemePicker } from '@/components/ThemePicker';
import { ProductivityInsights } from '@/components/ProductivityInsights';
import { MoodTracker } from '@/components/MoodTracker';
import { DailyStreak } from '@/components/DailyStreak';
import { QuickNotes } from '@/components/QuickNotes';
import { BreathingExercise } from '@/components/BreathingExercise';
import { useTasks } from '@/hooks/useTasks';
import { useCustomColors } from '@/hooks/useCustomColors';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { Task } from '@/types/task';

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

  return (
    <div className="min-h-screen bg-background mesh-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <DailyHeader
          date={today}
          tasks={tasks}
          onAddTask={() => handleAddTask()}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* New widgets row */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <DailyFocus />
          <QuoteWidget />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Main schedule */}
          <div className="lg:col-span-2">
            <main className="widget-card p-4 md:p-6 transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
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

          {/* Right: Sidebar widgets */}
          <div className="space-y-4">
            <UpcomingTasks tasks={tasks} onTaskClick={handleTaskClick} />
            <MiniCalendar />
            <MusicPlayer />
            <ThemePicker
              theme={theme}
              presets={presets}
              onPresetSelect={setPreset}
              onColorChange={updateTheme}
              onReset={resetTheme}
            />
            <ProductivityInsights tasks={tasks} />
          </div>
        </div>

        {/* Bottom widgets row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <DailyStreak />
          <MoodTracker />
          <QuickNotes />
          <BreathingExercise />
        </div>

        <footer className="mt-8 text-center text-sm text-muted-foreground transition-colors duration-500">
          Click on any time slot to add a task • Use the toolbox for quick tools
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
        onToggleComplete={toggleComplete}
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
