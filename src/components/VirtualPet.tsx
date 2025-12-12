import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePet } from '@/hooks/usePet';
import { Sparkles, ShoppingBag, Shirt, Edit2, Check } from 'lucide-react';

export const VirtualPet = () => {
  const {
    pet,
    buyClothing,
    equipClothing,
    unequipClothing,
    changePetType,
    changePetName,
    clothingItems,
    petTypes,
  } = usePet();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(pet.name);

  const getEquippedEmojis = () => {
    return pet.equippedClothing.map(id => {
      const item = clothingItems.find(i => i.id === id);
      return item?.emoji || '';
    }).join('');
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      changePetName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <Card className="widget-card p-6">
      {/* Pet Display */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="text-8xl mb-2 animate-bounce-slow">
            {pet.type}
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-3xl">
            {getEquippedEmojis()}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-32 h-8 text-center"
                maxLength={12}
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveName}>
                <Check className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold">{pet.name}</h2>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditingName(true)}>
                <Edit2 className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>

        <p className="text-sm text-muted-foreground">Level {pet.level}</p>

        {/* XP Bar */}
        <div className="mt-3 px-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>XP</span>
            <span>{pet.xp} / {pet.level * 100}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
              style={{ width: `${(pet.xp % 100)}%` }}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="shop" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shop" className="text-xs">
            <ShoppingBag className="w-3 h-3 mr-1" />
            Shop
          </TabsTrigger>
          <TabsTrigger value="closet" className="text-xs">
            <Shirt className="w-3 h-3 mr-1" />
            Closet
          </TabsTrigger>
          <TabsTrigger value="pet" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Pet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="mt-4">
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {clothingItems.filter(item => !pet.ownedClothing.includes(item.id)).map((item) => (
              <button
                key={item.id}
                onClick={() => buyClothing(item.id)}
                disabled={pet.xp < item.cost}
                className={`p-2 rounded-xl border border-border/50 transition-all ${
                  pet.xp >= item.cost
                    ? 'hover:bg-secondary/50 hover:scale-105'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl block mb-1">{item.emoji}</span>
                <span className="text-xs block">{item.name}</span>
                <span className="text-xs text-primary font-medium">{item.cost} XP</span>
              </button>
            ))}
            {clothingItems.filter(item => !pet.ownedClothing.includes(item.id)).length === 0 && (
              <p className="col-span-3 text-center text-sm text-muted-foreground py-4">
                You own everything! 🎉
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="closet" className="mt-4">
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {pet.ownedClothing.map((itemId) => {
              const item = clothingItems.find(i => i.id === itemId);
              if (!item) return null;
              const isEquipped = pet.equippedClothing.includes(itemId);
              return (
                <button
                  key={itemId}
                  onClick={() => isEquipped ? unequipClothing(itemId) : equipClothing(itemId)}
                  className={`p-2 rounded-xl transition-all ${
                    isEquipped
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'border border-border/50 hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{item.emoji}</span>
                  <span className="text-xs block">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {isEquipped ? 'Equipped' : 'Tap to wear'}
                  </span>
                </button>
              );
            })}
            {pet.ownedClothing.length === 0 && (
              <p className="col-span-3 text-center text-sm text-muted-foreground py-4">
                Visit the shop to buy items!
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pet" className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">Choose your pet:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {petTypes.map((type) => (
              <button
                key={type}
                onClick={() => changePetType(type)}
                className={`text-3xl p-2 rounded-xl transition-all ${
                  pet.type === type
                    ? 'bg-primary/20 scale-110'
                    : 'hover:bg-secondary/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
