import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePet } from '@/hooks/usePet';
import { Sparkles, ShoppingBag, Shirt, Edit2, Check, Star } from 'lucide-react';

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

  const handleSaveName = () => {
    if (tempName.trim()) {
      changePetName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const getEquippedByType = (type: 'hat' | 'accessory' | 'outfit') => {
    return pet.equippedClothing
      .map(id => clothingItems.find(i => i.id === id))
      .filter(item => item?.type === type)
      .map(item => item?.emoji)
      .join('');
  };

  const xpToNextLevel = 100 - (pet.xp % 100);
  const xpProgress = (pet.xp % 100);

  return (
    <Card className="widget-card p-6 overflow-hidden">
      {/* 3D Pet Display Platform */}
      <div className="relative mb-6">
        {/* Background glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-3xl animate-pulse" />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/40"
              style={{
                left: `${20 + i * 12}%`,
                top: `${10 + (i % 3) * 20}%`,
                animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* 3D Platform */}
        <div className="relative flex flex-col items-center pt-8">
          {/* Hat positioned above */}
          <div className="text-4xl z-20 mb-[-20px] drop-shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
            {getEquippedByType('hat')}
          </div>
          
          {/* Main Pet Container - 3D effect */}
          <div className="relative">
            {/* Shadow underneath */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/20 rounded-full blur-md" />
            
            {/* Pet body with 3D styling */}
            <div 
              className="relative z-10 transform transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
              }}
            >
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/40 to-transparent blur-xl scale-150" />
              
              {/* Pet emoji with 3D effect */}
              <div 
                className="text-[100px] leading-none relative"
                style={{
                  textShadow: '0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
                  transform: 'perspective(500px) rotateX(5deg)',
                }}
              >
                {pet.type}
              </div>
              
              {/* Accessory floating to the side */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-3xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
                {getEquippedByType('accessory')}
              </div>
            </div>
          </div>
          
          {/* Outfit below pet */}
          <div className="text-3xl mt-[-10px] z-20 drop-shadow-md">
            {getEquippedByType('outfit')}
          </div>
          
          {/* Platform base - 3D ellipse */}
          <div className="relative mt-2">
            <div className="w-32 h-4 bg-gradient-to-b from-secondary to-secondary/50 rounded-full" />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-3 bg-gradient-to-b from-secondary/80 to-transparent rounded-full" />
          </div>
        </div>

        {/* Level badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          <Star className="w-4 h-4 fill-current" />
          Lv.{pet.level}
        </div>
      </div>

      {/* Pet Name */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
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
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{pet.name}</h2>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsEditingName(true)}>
                <Edit2 className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* XP Bar - Enhanced */}
      <div className="mb-6 px-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span className="font-medium">Experience</span>
          <span className="font-bold text-primary">{pet.xp} XP</span>
        </div>
        <div className="relative h-4 bg-secondary/50 rounded-full overflow-hidden border border-border/50">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-all duration-700 ease-out"
            style={{ width: `${xpProgress}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-transparent transition-all duration-700"
            style={{ width: `${xpProgress * 0.6}%` }}
          />
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          <span className="text-primary font-medium">{xpToNextLevel}</span> XP to level {pet.level + 1}
        </p>
      </div>

      <Tabs defaultValue="shop" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="shop" className="text-xs gap-1">
            <ShoppingBag className="w-3 h-3" />
            Shop
          </TabsTrigger>
          <TabsTrigger value="closet" className="text-xs gap-1">
            <Shirt className="w-3 h-3" />
            Closet
          </TabsTrigger>
          <TabsTrigger value="pet" className="text-xs gap-1">
            <Sparkles className="w-3 h-3" />
            Pet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="mt-2">
          <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto p-1">
            {clothingItems.filter(item => !pet.ownedClothing.includes(item.id)).map((item) => (
              <button
                key={item.id}
                onClick={() => buyClothing(item.id)}
                disabled={pet.xp < item.cost}
                className={`group p-2 rounded-xl border transition-all duration-200 ${
                  pet.xp >= item.cost
                    ? 'border-border/50 hover:border-primary hover:bg-primary/10 hover:scale-105 hover:shadow-lg'
                    : 'opacity-40 cursor-not-allowed border-border/20'
                }`}
              >
                <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className="text-[10px] block truncate">{item.name}</span>
                <span className={`text-[10px] font-bold ${pet.xp >= item.cost ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.cost}
                </span>
              </button>
            ))}
            {clothingItems.filter(item => !pet.ownedClothing.includes(item.id)).length === 0 && (
              <p className="col-span-4 text-center text-sm text-muted-foreground py-6">
                🎉 You own everything!
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="closet" className="mt-2">
          <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto p-1">
            {pet.ownedClothing.map((itemId) => {
              const item = clothingItems.find(i => i.id === itemId);
              if (!item) return null;
              const isEquipped = pet.equippedClothing.includes(itemId);
              return (
                <button
                  key={itemId}
                  onClick={() => isEquipped ? unequipClothing(itemId) : equipClothing(itemId)}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isEquipped
                      ? 'bg-primary/20 border-2 border-primary shadow-lg scale-105'
                      : 'border border-border/50 hover:bg-secondary/50 hover:scale-105'
                  }`}
                >
                  <span className="text-2xl block mb-1">{item.emoji}</span>
                  <span className="text-[10px] block truncate">{item.name}</span>
                  <span className={`text-[10px] ${isEquipped ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    {isEquipped ? '✓ On' : 'Wear'}
                  </span>
                </button>
              );
            })}
            {pet.ownedClothing.length === 0 && (
              <p className="col-span-4 text-center text-sm text-muted-foreground py-6">
                Visit the shop to buy items!
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pet" className="mt-2">
          <p className="text-xs text-muted-foreground mb-3 text-center">Choose your companion:</p>
          <div className="grid grid-cols-4 gap-2">
            {petTypes.map((type) => (
              <button
                key={type}
                onClick={() => changePetType(type)}
                className={`text-3xl p-3 rounded-xl transition-all duration-200 ${
                  pet.type === type
                    ? 'bg-primary/20 border-2 border-primary scale-110 shadow-lg'
                    : 'border border-border/50 hover:bg-secondary/50 hover:scale-105'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </Card>
  );
};