import { Card } from '@/components/ui/card';
import { Book, FileText, Video, HelpCircle } from 'lucide-react';

const RESOURCES = [
  { icon: Book, name: 'Study Guides', color: 'from-blue-500 to-cyan-500', link: 'https://www.khanacademy.org' },
  { icon: FileText, name: 'Practice Tests', color: 'from-purple-500 to-pink-500', link: 'https://www.quizlet.com' },
  { icon: Video, name: 'Video Lessons', color: 'from-red-500 to-orange-500', link: 'https://www.youtube.com/education' },
  { icon: HelpCircle, name: 'Homework Help', color: 'from-green-500 to-emerald-500', link: 'https://www.chegg.com' },
];

export const StudyResources = () => {
  return (
    <Card className="p-4">
      <h3 className="font-medium text-sm mb-3">Study Resources</h3>
      <div className="grid grid-cols-2 gap-2">
        {RESOURCES.map((resource) => {
          const Icon = resource.icon;
          return (
            <a
              key={resource.name}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-300 hover:scale-105 group"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-medium truncate">{resource.name}</span>
            </a>
          );
        })}
      </div>
    </Card>
  );
};
