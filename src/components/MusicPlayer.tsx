import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, Volume2, VolumeX, CloudRain, Wind, Waves, Flame, Bird, Coffee } from 'lucide-react';

interface AmbientSound {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  frequencies: number[];
}

const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Rain', icon: CloudRain, color: 'from-blue-500 to-cyan-500', frequencies: [200, 400, 600] },
  { id: 'wind', name: 'Wind', icon: Wind, color: 'from-gray-400 to-slate-500', frequencies: [100, 150, 200] },
  { id: 'waves', name: 'Ocean', icon: Waves, color: 'from-teal-500 to-blue-500', frequencies: [80, 120, 160] },
  { id: 'fire', name: 'Fire', icon: Flame, color: 'from-orange-500 to-red-500', frequencies: [180, 220, 280] },
  { id: 'birds', name: 'Forest', icon: Bird, color: 'from-green-500 to-emerald-500', frequencies: [400, 600, 800] },
  { id: 'cafe', name: 'Cafe', icon: Coffee, color: 'from-amber-500 to-yellow-600', frequencies: [250, 350, 450] },
];

const createNoiseGenerator = (audioContext: AudioContext, type: string, frequencies: number[]) => {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  const oscillators: OscillatorNode[] = [];

  frequencies.forEach((freq) => {
    const oscillator = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();

    if (type === 'rain' || type === 'wind') {
      oscillator.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.value = freq;
    } else if (type === 'waves') {
      oscillator.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.value = freq;
      oscillator.frequency.value = freq / 10;
    } else {
      oscillator.type = 'triangle';
      filter.type = 'bandpass';
      filter.frequency.value = freq;
    }

    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    lfo.frequency.value = 0.1 + Math.random() * 0.2;
    lfoGain.gain.value = freq * 0.1;
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    lfo.start();

    oscillator.connect(filter);
    filter.connect(gainNode);
    oscillators.push(oscillator);
  });

  gainNode.connect(audioContext.destination);
  return { gainNode, oscillators };
};

export const MusicPlayer = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<{ gainNode: GainNode; oscillators: OscillatorNode[] } | null>(null);

  const startSound = (soundId: string) => {
    stopSound();
    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    noiseRef.current = createNoiseGenerator(audioContextRef.current, sound.id, sound.frequencies);
    noiseRef.current.oscillators.forEach(osc => osc.start());
    noiseRef.current.gainNode.gain.setTargetAtTime(isMuted ? 0 : volume * 0.15, audioContextRef.current.currentTime, 0.5);
    setActiveSound(soundId);
    setIsPlaying(true);
  };

  const stopSound = () => {
    if (noiseRef.current && audioContextRef.current) {
      noiseRef.current.gainNode.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.3);
      setTimeout(() => {
        noiseRef.current?.oscillators.forEach(osc => { try { osc.stop(); } catch (e) {} });
        audioContextRef.current?.close();
        noiseRef.current = null;
        audioContextRef.current = null;
      }, 500);
    }
    setIsPlaying(false);
    setActiveSound(null);
  };

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId && isPlaying) stopSound();
    else startSound(soundId);
  };

  useEffect(() => {
    if (noiseRef.current) {
      noiseRef.current.gainNode.gain.value = isMuted ? 0 : volume * 0.15;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => { stopSound(); };
  }, []);

  const activeAmbient = AMBIENT_SOUNDS.find(s => s.id === activeSound);

  return (
    <Card className="widget-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Music className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">Ambient Sounds</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {AMBIENT_SOUNDS.map((sound) => {
          const Icon = sound.icon;
          const isActive = activeSound === sound.id;
          return (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`p-3 rounded-xl transition-all ${
                isActive
                  ? `bg-gradient-to-br ${sound.color} text-white shadow-lg scale-105`
                  : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs">{sound.name}</span>
            </button>
          );
        })}
      </div>

      {activeAmbient && (
        <div className="space-y-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggleSound(activeAmbient.id)}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[volume * 100]}
              onValueChange={(v) => setVolume(v[0] / 100)}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </Card>
  );
};
