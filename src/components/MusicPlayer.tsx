import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Plus,
  Trash2,
  X,
  List
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Track {
  id: string;
  name: string;
  url: string;
}

const STORAGE_KEY = 'music-player-data';

export const MusicPlayer = () => {
  const [tracks, setTracks] = useState<Track[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isAddingTrack, setIsAddingTrack] = useState(false);
  const [newTrackName, setNewTrackName] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const currentTrack = tracks[currentTrackIndex];

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playPrevious = () => {
    if (tracks.length === 0) return;
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  };

  const playNext = () => {
    if (tracks.length === 0) return;
    const newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(progress) ? 0 : progress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const track: Track = {
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        url,
      };
      setTracks(prev => [...prev, track]);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addUrlTrack = () => {
    if (!newTrackName.trim() || !newTrackUrl.trim()) return;
    const track: Track = {
      id: crypto.randomUUID(),
      name: newTrackName.trim(),
      url: newTrackUrl.trim(),
    };
    setTracks(prev => [...prev, track]);
    setNewTrackName('');
    setNewTrackUrl('');
    setIsAddingTrack(false);
  };

  const deleteTrack = (id: string) => {
    const index = tracks.findIndex(t => t.id === id);
    setTracks(prev => prev.filter(t => t.id !== id));
    if (index <= currentTrackIndex && currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  return (
    <Card className="p-4 transition-all duration-500">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Music className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-medium text-sm">Music</span>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="h-8 w-8"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Now Playing */}
      <div className="text-center mb-3">
        <p className="text-sm font-medium truncate">
          {currentTrack?.name || 'No track selected'}
        </p>
        <p className="text-xs text-muted-foreground">
          {tracks.length} track{tracks.length !== 1 ? 's' : ''} in playlist
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 bg-secondary rounded-full mb-4 cursor-pointer overflow-hidden"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button size="icon" variant="ghost" onClick={playPrevious} disabled={tracks.length === 0}>
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          onClick={togglePlay}
          disabled={tracks.length === 0}
          className="w-10 h-10 rounded-full"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </Button>
        <Button size="icon" variant="ghost" onClick={playNext} disabled={tracks.length === 0}>
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsMuted(!isMuted)}
          className="h-8 w-8 shrink-0"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          onValueChange={([val]) => {
            setVolume(val / 100);
            setIsMuted(false);
          }}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Playlist</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAddingTrack(!isAddingTrack)}
              className="h-7 text-xs"
            >
              {isAddingTrack ? <X className="w-3 h-3" /> : 'Add URL'}
            </Button>
          </div>

          {isAddingTrack && (
            <div className="space-y-2 mb-3">
              <Input
                placeholder="Track name"
                value={newTrackName}
                onChange={(e) => setNewTrackName(e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                placeholder="Audio URL"
                value={newTrackUrl}
                onChange={(e) => setNewTrackUrl(e.target.value)}
                className="h-8 text-sm"
              />
              <Button size="sm" onClick={addUrlTrack} className="w-full h-8">
                Add Track
              </Button>
            </div>
          )}

          <ScrollArea className="h-32">
            <div className="space-y-1">
              {tracks.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No tracks yet. Click + to add music files.
                </p>
              ) : (
                tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      index === currentTrackIndex ? 'bg-primary/10' : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => playTrack(index)}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      index === currentTrackIndex && isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'
                    }`} />
                    <span className="text-sm truncate flex-1">{track.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTrack(track.id);
                      }}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
};
