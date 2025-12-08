import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

export const TextReader = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = () => {
    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    if (!text.trim()) return;

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text to read aloud..."
        className="min-h-[120px] resize-none"
      />

      {/* Voice selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Voice</label>
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger>
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Speed control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Speed</label>
          <span className="text-sm text-muted-foreground">{rate}x</span>
        </div>
        <Slider
          value={[rate]}
          onValueChange={([v]) => setRate(v)}
          min={0.5}
          max={2}
          step={0.1}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isPlaying || isPaused ? (
          <Button onClick={handlePlay} className="flex-1 gap-2">
            <Play className="w-4 h-4" />
            {isPaused ? 'Resume' : 'Play'}
          </Button>
        ) : (
          <Button onClick={handlePause} variant="secondary" className="flex-1 gap-2">
            <Pause className="w-4 h-4" />
            Pause
          </Button>
        )}
        <Button onClick={handleStop} variant="outline" disabled={!isPlaying && !isPaused}>
          <Square className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
