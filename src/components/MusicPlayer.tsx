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
  // Using free ambient sound URLs (royalty-free)
  frequencies: number[];
}
const AMBIENT_SOUNDS: AmbientSound[] = [{
  id: 'rain',
  name: 'Rain',
  icon: CloudRain,
  color: 'from-blue-500 to-cyan-500',
  frequencies: [200, 400, 600]
}, {
  id: 'wind',
  name: 'Wind',
  icon: Wind,
  color: 'from-gray-400 to-slate-500',
  frequencies: [100, 150, 200]
}, {
  id: 'waves',
  name: 'Ocean',
  icon: Waves,
  color: 'from-teal-500 to-blue-500',
  frequencies: [80, 120, 160]
}, {
  id: 'fire',
  name: 'Fire',
  icon: Flame,
  color: 'from-orange-500 to-red-500',
  frequencies: [180, 220, 280]
}, {
  id: 'birds',
  name: 'Forest',
  icon: Bird,
  color: 'from-green-500 to-emerald-500',
  frequencies: [400, 600, 800]
}, {
  id: 'cafe',
  name: 'Cafe',
  icon: Coffee,
  color: 'from-amber-500 to-yellow-600',
  frequencies: [250, 350, 450]
}];

// White/brown noise generator using Web Audio API
const createNoiseGenerator = (audioContext: AudioContext, type: string, frequencies: number[]) => {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0;
  const oscillators: OscillatorNode[] = [];
  const filters: BiquadFilterNode[] = [];
  frequencies.forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();

    // Create different noise characteristics
    if (type === 'rain' || type === 'wind') {
      // Brown noise-like
      oscillator.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.value = freq;
      filter.Q.value = 0.5;
    } else if (type === 'waves') {
      // Low rumble
      oscillator.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.value = freq;
      oscillator.frequency.value = freq / 10;
    } else if (type === 'fire') {
      // Crackling
      oscillator.type = 'triangle';
      filter.type = 'bandpass';
      filter.frequency.value = freq;
    } else {
      // General ambient
      oscillator.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.value = freq;
    }

    // Add slight random variation
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
    filters.push(filter);
  });
  gainNode.connect(audioContext.destination);
  return {
    gainNode,
    oscillators,
    filters
  };
};
export const MusicPlayer = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<{
    gainNode: GainNode;
    oscillators: OscillatorNode[];
    filters: BiquadFilterNode[];
  } | null>(null);
  const startSound = (soundId: string) => {
    // Stop current sound if any
    stopSound();
    const sound = AMBIENT_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    // Create audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    noiseRef.current = createNoiseGenerator(audioContextRef.current, sound.id, sound.frequencies);

    // Start oscillators
    noiseRef.current.oscillators.forEach(osc => {
      osc.start();
    });

    // Fade in
    noiseRef.current.gainNode.gain.setTargetAtTime(isMuted ? 0 : volume * 0.15, audioContextRef.current.currentTime, 0.5);
    setActiveSound(soundId);
    setIsPlaying(true);
  };
  const stopSound = () => {
    if (noiseRef.current && audioContextRef.current) {
      // Fade out
      noiseRef.current.gainNode.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.3);

      // Stop after fade
      setTimeout(() => {
        noiseRef.current?.oscillators.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {}
        });
        audioContextRef.current?.close();
        noiseRef.current = null;
        audioContextRef.current = null;
      }, 500);
    }
    setIsPlaying(false);
    setActiveSound(null);
  };
  const toggleSound = (soundId: string) => {
    if (activeSound === soundId && isPlaying) {
      stopSound();
    } else {
      startSound(soundId);
    }
  };
  useEffect(() => {
    if (noiseRef.current) {
      noiseRef.current.gainNode.gain.value = isMuted ? 0 : volume * 0.15;
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);
  const activeAmbient = AMBIENT_SOUNDS.find(s => s.id === activeSound);
  return;
};