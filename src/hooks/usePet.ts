import { useState, useEffect } from 'react';

export interface PetClothing {
  id: string;
  name: string;
  emoji: string;
  type: 'hat' | 'accessory' | 'outfit';
}

export interface Pet {
  name: string;
  type: string;
  equippedClothing: string[];
}

const CLOTHING_ITEMS: PetClothing[] = [
  // Hats (15 items)
  { id: 'crown', name: 'Crown', emoji: '👑', type: 'hat' },
  { id: 'tophat', name: 'Top Hat', emoji: '🎩', type: 'hat' },
  { id: 'cap', name: 'Cap', emoji: '🧢', type: 'hat' },
  { id: 'party', name: 'Party Hat', emoji: '🥳', type: 'hat' },
  { id: 'cowboy', name: 'Cowboy', emoji: '🤠', type: 'hat' },
  { id: 'wizard', name: 'Wizard', emoji: '🧙', type: 'hat' },
  { id: 'helmet', name: 'Helmet', emoji: '⛑️', type: 'hat' },
  { id: 'beret', name: 'Beret', emoji: '🎨', type: 'hat' },
  { id: 'graduation', name: 'Grad Cap', emoji: '🎓', type: 'hat' },
  { id: 'turban', name: 'Turban', emoji: '🧕', type: 'hat' },
  { id: 'santa', name: 'Santa Hat', emoji: '🎅', type: 'hat' },
  { id: 'chef', name: 'Chef Hat', emoji: '👨‍🍳', type: 'hat' },
  { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', type: 'hat' },
  { id: 'alien', name: 'Alien', emoji: '👽', type: 'hat' },
  { id: 'robot', name: 'Robot', emoji: '🤖', type: 'hat' },
  
  // Accessories (20 items)
  { id: 'ribbon', name: 'Ribbon', emoji: '🎀', type: 'accessory' },
  { id: 'glasses', name: 'Cool Shades', emoji: '😎', type: 'accessory' },
  { id: 'bowtie', name: 'Bow Tie', emoji: '🎗️', type: 'accessory' },
  { id: 'sparkles', name: 'Sparkles', emoji: '✨', type: 'accessory' },
  { id: 'star', name: 'Star Badge', emoji: '⭐', type: 'accessory' },
  { id: 'flower', name: 'Flower', emoji: '🌸', type: 'accessory' },
  { id: 'heart', name: 'Heart', emoji: '❤️', type: 'accessory' },
  { id: 'music', name: 'Music', emoji: '🎵', type: 'accessory' },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', type: 'accessory' },
  { id: 'fire', name: 'Fire', emoji: '🔥', type: 'accessory' },
  { id: 'lightning', name: 'Lightning', emoji: '⚡', type: 'accessory' },
  { id: 'snowflake', name: 'Snowflake', emoji: '❄️', type: 'accessory' },
  { id: 'moon', name: 'Moon', emoji: '🌙', type: 'accessory' },
  { id: 'sun', name: 'Sun', emoji: '☀️', type: 'accessory' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', type: 'accessory' },
  { id: 'diamond', name: 'Diamond', emoji: '💎', type: 'accessory' },
  { id: 'trophy', name: 'Trophy', emoji: '🏆', type: 'accessory' },
  { id: 'medal', name: 'Medal', emoji: '🥇', type: 'accessory' },
  { id: 'balloon', name: 'Balloon', emoji: '🎈', type: 'accessory' },
  { id: 'magic', name: 'Magic Wand', emoji: '🪄', type: 'accessory' },
  
  // Outfits (15 items)
  { id: 'scarf', name: 'Scarf', emoji: '🧣', type: 'outfit' },
  { id: 'cape', name: 'Cape', emoji: '🦸', type: 'outfit' },
  { id: 'ninja', name: 'Ninja', emoji: '🥷', type: 'outfit' },
  { id: 'astronaut', name: 'Astronaut', emoji: '👨‍🚀', type: 'outfit' },
  { id: 'king', name: 'Royal', emoji: '🤴', type: 'outfit' },
  { id: 'fairy', name: 'Fairy', emoji: '🧚', type: 'outfit' },
  { id: 'vampire', name: 'Vampire', emoji: '🧛', type: 'outfit' },
  { id: 'mermaid', name: 'Mermaid', emoji: '🧜', type: 'outfit' },
  { id: 'superhero', name: 'Superhero', emoji: '🦹', type: 'outfit' },
  { id: 'elf', name: 'Elf', emoji: '🧝', type: 'outfit' },
  { id: 'genie', name: 'Genie', emoji: '🧞', type: 'outfit' },
  { id: 'zombie', name: 'Zombie', emoji: '🧟', type: 'outfit' },
  { id: 'detective', name: 'Detective', emoji: '🕵️', type: 'outfit' },
  { id: 'pilot', name: 'Pilot', emoji: '👨‍✈️', type: 'outfit' },
  { id: 'scientist', name: 'Scientist', emoji: '👨‍🔬', type: 'outfit' },
];

const PET_TYPES = ['🐱', '🐶', '🐰', '🐻', '🐼', '🦊', '🐨', '🐯', '🦁', '🐸', '🐵', '🦄', '🐲', '🦖', '🐙', '🦑'];

const STORAGE_KEY = 'virtual-pet';

export const usePet = () => {
  const [pet, setPet] = useState<Pet>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { name: parsed.name || 'Buddy', type: parsed.type || '🐱', equippedClothing: parsed.equippedClothing || [] };
    }
    return { name: 'Buddy', type: '🐱', equippedClothing: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  }, [pet]);

  const equipClothing = (itemId: string) => {
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
    equipClothing,
    unequipClothing,
    changePetType,
    changePetName,
    clothingItems: CLOTHING_ITEMS,
    petTypes: PET_TYPES,
  };
};