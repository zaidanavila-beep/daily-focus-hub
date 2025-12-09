import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calculator } from './tools/Calculator';
import { TextReader } from './tools/TextReader';
import { Stopwatch } from './tools/Stopwatch';
import { PomodoroTimer } from './tools/PomodoroTimer';
import { NotesPad } from './tools/NotesPad';
import { AITutor } from './tools/AITutor';
import { Flashcards } from './tools/Flashcards';
import { GradeCalculator } from './tools/GradeCalculator';
import { UnitConverter } from './tools/UnitConverter';
import { HabitTracker } from './tools/HabitTracker';
import { 
  LayoutGrid, 
  Calculator as CalcIcon, 
  Volume2, 
  Timer, 
  Clock, 
  StickyNote,
  Bot,
  Layers,
  GraduationCap,
  ArrowRightLeft,
  Target
} from 'lucide-react';

const TOOL_CATEGORIES = {
  learning: {
    label: '📚 Learning',
    tools: [
      { id: 'tutor', label: 'AI Tutor', icon: Bot, component: AITutor },
      { id: 'flashcards', label: 'Flashcards', icon: Layers, component: Flashcards },
      { id: 'grades', label: 'Grades', icon: GraduationCap, component: GradeCalculator },
    ],
  },
  productivity: {
    label: '⚡ Productivity',
    tools: [
      { id: 'pomodoro', label: 'Focus', icon: Clock, component: PomodoroTimer },
      { id: 'stopwatch', label: 'Timer', icon: Timer, component: Stopwatch },
      { id: 'habits', label: 'Habits', icon: Target, component: HabitTracker },
      { id: 'notes', label: 'Notes', icon: StickyNote, component: NotesPad },
    ],
  },
  utilities: {
    label: '🔧 Utilities',
    tools: [
      { id: 'calculator', label: 'Calc', icon: CalcIcon, component: Calculator },
      { id: 'converter', label: 'Convert', icon: ArrowRightLeft, component: UnitConverter },
      { id: 'reader', label: 'Reader', icon: Volume2, component: TextReader },
    ],
  },
};

export const ToolsMenu = () => {
  const [open, setOpen] = useState(false);
  const [activeTool, setActiveTool] = useState('tutor');

  const allTools = Object.values(TOOL_CATEGORIES).flatMap(cat => cat.tools);
  const ActiveComponent = allTools.find(t => t.id === activeTool)?.component || AITutor;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl shadow-large hover:shadow-colored transition-all gradient-bg"
        >
          <LayoutGrid className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="font-serif text-2xl">Student Toolbox</SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 p-6 pt-4">
          {/* Tool Selector */}
          <div className="space-y-3 mb-4">
            {Object.entries(TOOL_CATEGORIES).map(([catKey, category]) => (
              <div key={catKey}>
                <p className="text-xs text-muted-foreground mb-2">{category.label}</p>
                <div className="flex flex-wrap gap-2">
                  {category.tools.map(tool => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <Button
                        key={tool.id}
                        size="sm"
                        variant={isActive ? 'default' : 'outline'}
                        className={`gap-2 ${isActive ? '' : 'bg-secondary/50'}`}
                        onClick={() => setActiveTool(tool.id)}
                      >
                        <Icon className="w-4 h-4" />
                        {tool.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Active Tool Content */}
          <ScrollArea className="flex-1 -mr-4 pr-4">
            <div className="bg-card rounded-xl p-4 border shadow-soft">
              <ActiveComponent />
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
