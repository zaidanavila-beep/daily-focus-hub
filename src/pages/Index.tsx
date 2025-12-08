import { useState } from 'react';
import { DailyHeader } from '@/components/DailyHeader';
import { DailyTimeline } from '@/components/DailyTimeline';
import { TaskDialog } from '@/components/TaskDialog';
import { SettingsDialog } from '@/components/SettingsDialog';
import { ToolsMenu } from '@/components/ToolsMenu';
import { useTasks } from '@/hooks/useTasks';
import { useCustomColors } from '@/hooks/useCustomColors';
import { useNotifications } from '@/hooks/useNotifications';
import { Task } from '@/types/task';

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const { colors, updateColor, resetColors } = useCustomColors();
  const { requestPermission } = useNotifications(tasks);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultHour, setDefaultHour] = useState<number | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const today = new Date();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDefaultHour(undefined);
    setDialogOpen(true);
  };

  const handleAddTask = (hour?: number) => {
    setSelectedTask(null);
    setDefaultHour(hour);
    setDialogOpen(true);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    setNotificationsEnabled(granted);
  };

  return (
    <div className="min-h-screen bg-background mesh-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <DailyHeader
          date={today}
          tasks={tasks}
          onAddTask={() => handleAddTask()}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <main className="widget-card mt-8 p-4 md:p-6">
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

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          Click on any time slot to add a task • Use the toolbox for quick tools
        </footer>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        defaultHour={defaultHour}
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
