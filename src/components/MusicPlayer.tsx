import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Music, 
  Search,
  Play,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
}

// Popular study/chill playlists and lofi channels
const SUGGESTED_SEARCHES = [
  'lofi hip hop beats',
  'study music playlist',
  'chill beats to study',
  'relaxing piano music',
  'ambient focus music',
  'jazz cafe music',
];

const QUICK_STATIONS = [
  { name: 'Lofi Girl', videoId: 'jfKfPfyJRdk', color: 'from-purple-500 to-pink-500' },
  { name: 'Chillhop', videoId: '5yx6BWlEVcY', color: 'from-orange-500 to-red-500' },
  { name: 'Jazz Vibes', videoId: 'Dx5qFachd3A', color: 'from-amber-500 to-yellow-500' },
  { name: 'Nature Sounds', videoId: 'eKFTSSKCzWA', color: 'from-green-500 to-emerald-500' },
];

export const MusicPlayer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Open YouTube search in new tab
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + ' music')}`;
    window.open(searchUrl, '_blank');
  };

  const playStation = (videoId: string, title: string) => {
    setCurrentVideoId(videoId);
    setCurrentTitle(title);
    setShowPlayer(true);
    setIsMinimized(false);
  };

  const closePlayer = () => {
    setCurrentVideoId(null);
    setShowPlayer(false);
    setCurrentTitle('');
  };

  return (
    <Card className="p-4 transition-all duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Music className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-medium text-sm">Music Station</span>
        </div>
        {showPlayer && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-7 w-7"
          >
            {isMinimized ? <Play className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search YouTube music..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="h-9 text-sm"
        />
        <Button size="icon" onClick={handleSearch} className="h-9 w-9 shrink-0">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Stations */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Quick Stations (Live)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_STATIONS.map((station) => (
            <button
              key={station.videoId}
              onClick={() => playStation(station.videoId, station.name)}
              className={`p-2 rounded-lg bg-gradient-to-br ${station.color} text-white text-xs font-medium hover:opacity-90 transition-all hover:scale-105 active:scale-95`}
            >
              {station.name}
            </button>
          ))}
        </div>
      </div>

      {/* YouTube Player */}
      {showPlayer && currentVideoId && !isMinimized && (
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&loop=1`}
              title={currentTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs truncate flex-1">{currentTitle}</p>
            <Button
              size="icon"
              variant="ghost"
              onClick={closePlayer}
              className="h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Now Playing Mini */}
      {showPlayer && isMinimized && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs truncate flex-1">Playing: {currentTitle}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={closePlayer}
            className="h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Suggested Searches */}
      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-muted-foreground mb-2">Try searching:</p>
        <div className="flex flex-wrap gap-1">
          {SUGGESTED_SEARCHES.slice(0, 4).map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearchQuery(term);
                const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`;
                window.open(searchUrl, '_blank');
              }}
              className="text-xs px-2 py-1 rounded-full bg-secondary/70 hover:bg-secondary transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
