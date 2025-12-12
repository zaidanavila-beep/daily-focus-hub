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
  { id: 'crown', name: 'Crown', emoji: '👑', cost: 50, type: 'hat' },
  { id: 'tophat', name: 'Top Hat', emoji: '🎩', cost: 30, type: 'hat' },
  { id: 'cap', name: 'Cap', emoji: '🧢', cost: 20, type: 'hat' },
  { id: 'ribbon', name: 'Ribbon', emoji: '🎀', cost: 15, type: 'accessory' },
  { id: 'glasses', name: 'Cool Glasses', emoji: '😎', cost: 25, type: 'accessory' },
  { id: 'bowtie', name: 'Bow Tie', emoji: '🎗️', cost: 20, type: 'accessory' },
  { id: 'scarf', name: 'Scarf', emoji: '🧣', cost: 35, type: 'outfit' },
  { id: 'cape', name: 'Cape', emoji: '🦸', cost: 60, type: 'outfit' },
  { id: 'sparkles', name: 'Sparkles', emoji: '✨', cost: 40, type: 'accessory' },
  { id: 'star', name: 'Star Badge', emoji: '⭐', cost: 45, type: 'accessory' },
  { id: 'flower', name: 'Flower', emoji: '🌸', cost: 15, type: 'accessory' },
  { id: 'party', name: 'Party Hat', emoji: '🥳', cost: 25, type: 'hat' },
];

const PET_TYPES = ['🐱', '🐶', '🐰', '🐻', '🐼', '🦊', '🐨', '🐯'];

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
