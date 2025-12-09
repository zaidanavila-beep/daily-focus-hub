import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

interface Grade {
  id: string;
  name: string;
  score: number;
  weight: number;
}

const STORAGE_KEY = 'grade-calculator-data';

const getLetterGrade = (percentage: number): { letter: string; color: string } => {
  if (percentage >= 90) return { letter: 'A', color: 'text-green-500' };
  if (percentage >= 80) return { letter: 'B', color: 'text-blue-500' };
  if (percentage >= 70) return { letter: 'C', color: 'text-yellow-500' };
  if (percentage >= 60) return { letter: 'D', color: 'text-orange-500' };
  return { letter: 'F', color: 'text-red-500' };
};

export const GradeCalculator = () => {
  const [grades, setGrades] = useState<Grade[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('');
  const [newWeight, setNewWeight] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
  }, [grades]);

  const addGrade = () => {
    if (!newName.trim() || !newScore || !newWeight) return;
    const grade: Grade = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      score: parseFloat(newScore),
      weight: parseFloat(newWeight),
    };
    setGrades(prev => [...prev, grade]);
    setNewName('');
    setNewScore('');
    setNewWeight('');
  };

  const deleteGrade = (id: string) => {
    setGrades(prev => prev.filter(g => g.id !== id));
  };

  const reset = () => {
    setGrades([]);
  };

  const calculateWeightedAverage = (): number => {
    if (grades.length === 0) return 0;
    const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
    if (totalWeight === 0) return 0;
    const weightedSum = grades.reduce((sum, g) => sum + (g.score * g.weight), 0);
    return weightedSum / totalWeight;
  };

  const average = calculateWeightedAverage();
  const { letter, color } = getLetterGrade(average);
  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);

  return (
    <div className="space-y-4">
      <Card className="p-4 text-center bg-gradient-to-br from-primary/10 to-primary/5">
        <p className="text-xs text-muted-foreground mb-1">Weighted Average</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl font-bold">{average.toFixed(1)}%</span>
          <span className={`text-2xl font-bold ${color}`}>{letter}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Total weight: {totalWeight}%
        </p>
      </Card>

      <div className="grid grid-cols-12 gap-2">
        <Input
          className="col-span-4"
          placeholder="Assignment"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Input
          className="col-span-3"
          type="number"
          placeholder="Score %"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          min="0"
          max="100"
        />
        <Input
          className="col-span-3"
          type="number"
          placeholder="Weight %"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          min="0"
          max="100"
        />
        <Button
          size="icon"
          className="col-span-2"
          onClick={addGrade}
          disabled={!newName.trim() || !newScore || !newWeight}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {grades.map(grade => {
          const { letter: gradeLetter, color: gradeColor } = getLetterGrade(grade.score);
          return (
            <div
              key={grade.id}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{grade.name}</p>
                <p className="text-xs text-muted-foreground">{grade.weight}% weight</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-bold ${gradeColor}`}>
                  {grade.score}% ({gradeLetter})
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteGrade(grade.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {grades.length > 0 && (
        <Button variant="outline" className="w-full" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      )}
    </div>
  );
};
