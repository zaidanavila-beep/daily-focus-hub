import { useState } from 'react';
import { DailyHeader } from '@/components/DailyHeader';
import { DailyTimeline } from '@/components/DailyTimeline';
import { TaskDialog } from '@/components/TaskDialog';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultHour, setDefaultHour] = useState<number | undefined>();

  const today = new Date();
  const completedCount = tasks.filter((t) => t.completed).length;

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <DailyHeader
          date={today}
          taskCount={tasks.length}
          completedCount={completedCount}
          onAddTask={() => handleAddTask()}
        />

        <main className="bg-card rounded-2xl shadow-soft p-4 md:p-6">
          <DailyTimeline
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        </main>

        <footer className="mt-8 text-center text-sm text-muted-foreground">
          Click on a time slot to add a task
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
    </div>
  );
};

export default Index;
