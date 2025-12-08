import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calculator } from './tools/Calculator';
import { TextReader } from './tools/TextReader';
import { Stopwatch } from './tools/Stopwatch';
import { PomodoroTimer } from './tools/PomodoroTimer';
import { NotesPad } from './tools/NotesPad';
import { 
  LayoutGrid, 
  Calculator as CalcIcon, 
  Volume2, 
  Timer, 
  Clock, 
  StickyNote 
} from 'lucide-react';

export const ToolsMenu = () => {
  const [open, setOpen] = useState(false);

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
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Toolbox</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="calculator" className="mt-6">
          <TabsList className="grid grid-cols-5 w-full h-auto p-1 bg-secondary/50">
            <TabsTrigger value="calculator" className="flex flex-col gap-1 h-auto py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft rounded-xl">
              <CalcIcon className="w-4 h-4" />
              <span className="text-[10px]">Calc</span>
            </TabsTrigger>
            <TabsTrigger value="reader" className="flex flex-col gap-1 h-auto py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft rounded-xl">
              <Volume2 className="w-4 h-4" />
              <span className="text-[10px]">Reader</span>
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex flex-col gap-1 h-auto py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft rounded-xl">
              <Timer className="w-4 h-4" />
              <span className="text-[10px]">Timer</span>
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="flex flex-col gap-1 h-auto py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft rounded-xl">
              <Clock className="w-4 h-4" />
              <span className="text-[10px]">Focus</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex flex-col gap-1 h-auto py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-soft rounded-xl">
              <StickyNote className="w-4 h-4" />
              <span className="text-[10px]">Notes</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="calculator" className="m-0">
              <Calculator />
            </TabsContent>
            <TabsContent value="reader" className="m-0">
              <TextReader />
            </TabsContent>
            <TabsContent value="stopwatch" className="m-0">
              <Stopwatch />
            </TabsContent>
            <TabsContent value="pomodoro" className="m-0">
              <PomodoroTimer />
            </TabsContent>
            <TabsContent value="notes" className="m-0">
              <NotesPad />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
