import { useState, useEffect } from 'react';

export interface PetClothing {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  type: 'hat' | 'accessory' | 'outfit';
}

export interface Pet {
  name: string;
  type: string;
  xp: number;
  level: number;
  ownedClothing: string[];
  equippedClothing: string[];
}

const CLOTHING_ITEMS: PetClothing[] = [
  // Hats (15 items)
  { id: 'crown', name: 'Crown', emoji: '👑', cost: 50, type: 'hat' },
  { id: 'tophat', name: 'Top Hat', emoji: '🎩', cost: 30, type: 'hat' },
  { id: 'cap', name: 'Cap', emoji: '🧢', cost: 20, type: 'hat' },
  { id: 'party', name: 'Party Hat', emoji: '🥳', cost: 25, type: 'hat' },
  { id: 'cowboy', name: 'Cowboy', emoji: '🤠', cost: 35, type: 'hat' },
  { id: 'wizard', name: 'Wizard', emoji: '🧙', cost: 55, type: 'hat' },
  { id: 'helmet', name: 'Helmet', emoji: '⛑️', cost: 40, type: 'hat' },
  { id: 'beret', name: 'Beret', emoji: '🎨', cost: 35, type: 'hat' },
  { id: 'graduation', name: 'Grad Cap', emoji: '🎓', cost: 60, type: 'hat' },
  { id: 'turban', name: 'Turban', emoji: '🧕', cost: 45, type: 'hat' },
  { id: 'santa', name: 'Santa Hat', emoji: '🎅', cost: 50, type: 'hat' },
  { id: 'chef', name: 'Chef Hat', emoji: '👨‍🍳', cost: 40, type: 'hat' },
  { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', cost: 55, type: 'hat' },
  { id: 'alien', name: 'Alien', emoji: '👽', cost: 70, type: 'hat' },
  { id: 'robot', name: 'Robot', emoji: '🤖', cost: 75, type: 'hat' },
  
  // Accessories (20 items)
  { id: 'ribbon', name: 'Ribbon', emoji: '🎀', cost: 15, type: 'accessory' },
  { id: 'glasses', name: 'Cool Shades', emoji: '😎', cost: 25, type: 'accessory' },
  { id: 'bowtie', name: 'Bow Tie', emoji: '🎗️', cost: 20, type: 'accessory' },
  { id: 'sparkles', name: 'Sparkles', emoji: '✨', cost: 40, type: 'accessory' },
  { id: 'star', name: 'Star Badge', emoji: '⭐', cost: 45, type: 'accessory' },
  { id: 'flower', name: 'Flower', emoji: '🌸', cost: 15, type: 'accessory' },
  { id: 'heart', name: 'Heart', emoji: '❤️', cost: 20, type: 'accessory' },
  { id: 'music', name: 'Music', emoji: '🎵', cost: 30, type: 'accessory' },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', cost: 50, type: 'accessory' },
  { id: 'fire', name: 'Fire', emoji: '🔥', cost: 35, type: 'accessory' },
  { id: 'lightning', name: 'Lightning', emoji: '⚡', cost: 40, type: 'accessory' },
  { id: 'snowflake', name: 'Snowflake', emoji: '❄️', cost: 30, type: 'accessory' },
  { id: 'moon', name: 'Moon', emoji: '🌙', cost: 45, type: 'accessory' },
  { id: 'sun', name: 'Sun', emoji: '☀️', cost: 45, type: 'accessory' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', cost: 35, type: 'accessory' },
  { id: 'diamond', name: 'Diamond', emoji: '💎', cost: 80, type: 'accessory' },
  { id: 'trophy', name: 'Trophy', emoji: '🏆', cost: 100, type: 'accessory' },
  { id: 'medal', name: 'Medal', emoji: '🥇', cost: 60, type: 'accessory' },
  { id: 'balloon', name: 'Balloon', emoji: '🎈', cost: 20, type: 'accessory' },
  { id: 'magic', name: 'Magic Wand', emoji: '🪄', cost: 65, type: 'accessory' },
  
  // Outfits (15 items)
  { id: 'scarf', name: 'Scarf', emoji: '🧣', cost: 35, type: 'outfit' },
  { id: 'cape', name: 'Cape', emoji: '🦸', cost: 60, type: 'outfit' },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', cost: 70, type: 'outfit' },
  { id: 'astronaut', name: 'Astronaut', emoji: '👨‍🚀', cost: 80, type: 'outfit' },
  { id: 'king', name: 'Royal', emoji: '🤴', cost: 90, type: 'outfit' },
  { id: 'fairy', name: 'Fairy', emoji: '🧚', cost: 75, type: 'outfit' },
  { id: 'vampire', name: 'Vampire', emoji: '🧛', cost: 65, type: 'outfit' },
  { id: 'mermaid', name: 'Mermaid', emoji: '🧜', cost: 85, type: 'outfit' },
  { id: 'superhero', name: 'Superhero', emoji: '🦹', cost: 95, type: 'outfit' },
  { id: 'elf', name: 'Elf', emoji: '🧝', cost: 70, type: 'outfit' },
  { id: 'genie', name: 'Genie', emoji: '🧞', cost: 100, type: 'outfit' },
  { id: 'zombie', name: 'Zombie', emoji: '🧟', cost: 55, type: 'outfit' },
  { id: 'detective', name: 'Detective', emoji: '🕵️', cost: 65, type: 'outfit' },
  { id: 'pilot', name: 'Pilot', emoji: '👨‍✈️', cost: 75, type: 'outfit' },
  { id: 'scientist', name: 'Scientist', emoji: '👨‍🔬', cost: 70, type: 'outfit' },
];

const PET_TYPES = ['🐱', '🐶', '🐰', '🐻', '🐼', '🦊', '🐨', '🐯', '🦁', '🐸', '🐵', '🦄', '🐲', '🦖', '🐙', '🦑'];

const STORAGE_KEY = 'virtual-pet';

const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

export const usePet = () => {
  const [pet, setPet] = useState<Pet>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return {
      name: 'Buddy',
      type: '🐱',
      xp: 0,
      level: 1,
      ownedClothing: [],
      equippedClothing: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  }, [pet]);

  const addXP = (amount: number) => {
    setPet(prev => ({
      ...prev,
      xp: prev.xp + amount,
      level: calculateLevel(prev.xp + amount),
    }));
  };

  const buyClothing = (itemId: string) => {
    const item = CLOTHING_ITEMS.find(i => i.id === itemId);
    if (!item || pet.ownedClothing.includes(itemId) || pet.xp < item.cost) return false;
    
    setPet(prev => ({
      ...prev,
      xp: prev.xp - item.cost,
      level: calculateLevel(prev.xp - item.cost),
      ownedClothing: [...prev.ownedClothing, itemId],
    }));
    return true;
  };

  const equipClothing = (itemId: string) => {
    if (!pet.ownedClothing.includes(itemId)) return;
    const item = CLOTHING_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    setPet(prev => {
      const currentEquipped = prev.equippedClothing.filter(id => {
        const equipped = CLOTHING_ITEMS.find(i => i.id === id);
        return equipped?.type !== item.type;
      });
      return { ...prev, equippedClothing: [...currentEquipped, itemId] };
    });
  };

  const unequipClothing = (itemId: string) => {
    setPet(prev => ({
      ...prev,
      equippedClothing: prev.equippedClothing.filter(id => id !== itemId),
    }));
  };

  const changePetType = (type: string) => {
    setPet(prev => ({ ...prev, type }));
  };

  const changePetName = (name: string) => {
    setPet(prev => ({ ...prev, name }));
  };

  return {
    pet,
    addXP,
    buyClothing,
    equipClothing,
    unequipClothing,
    changePetType,
    changePetName,
    clothingItems: CLOTHING_ITEMS,
    petTypes: PET_TYPES,
  };
};