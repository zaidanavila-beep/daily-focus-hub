import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePet } from '@/hooks/usePet';
import { Sparkles, Shirt, Edit2, Check } from 'lucide-react';

export const VirtualPet = () => {
  const {
    pet,
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

  const hats = clothingItems.filter(i => i.type === 'hat');
  const accessories = clothingItems.filter(i => i.type === 'accessory');
  const outfits = clothingItems.filter(i => i.type === 'outfit');

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

      <Tabs defaultValue="closet" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-2">
          <TabsTrigger value="closet" className="text-xs gap-1">
            <Shirt className="w-3 h-3" />
            Closet
          </TabsTrigger>
          <TabsTrigger value="pet" className="text-xs gap-1">
            <Sparkles className="w-3 h-3" />
            Pet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="closet" className="mt-2">
          <div className="space-y-4 max-h-64 overflow-y-auto p-1">
            {/* Hats */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">🎩 Hats</p>
              <div className="grid grid-cols-5 gap-1">
                {hats.map((item) => {
                  const isEquipped = pet.equippedClothing.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => isEquipped ? unequipClothing(item.id) : equipClothing(item.id)}
                      className={`p-2 rounded-lg transition-all ${
                        isEquipped
                          ? 'bg-primary/20 border-2 border-primary scale-105'
                          : 'border border-border/50 hover:bg-secondary/50 hover:scale-105'
                      }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">✨ Accessories</p>
              <div className="grid grid-cols-5 gap-1">
                {accessories.map((item) => {
                  const isEquipped = pet.equippedClothing.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => isEquipped ? unequipClothing(item.id) : equipClothing(item.id)}
                      className={`p-2 rounded-lg transition-all ${
                        isEquipped
                          ? 'bg-primary/20 border-2 border-primary scale-105'
                          : 'border border-border/50 hover:bg-secondary/50 hover:scale-105'
                      }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Outfits */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">👕 Outfits</p>
              <div className="grid grid-cols-5 gap-1">
                {outfits.map((item) => {
                  const isEquipped = pet.equippedClothing.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => isEquipped ? unequipClothing(item.id) : equipClothing(item.id)}
                      className={`p-2 rounded-lg transition-all ${
                        isEquipped
                          ? 'bg-primary/20 border-2 border-primary scale-105'
                          : 'border border-border/50 hover:bg-secondary/50 hover:scale-105'
                      }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                    </button>
                  );
                })}
              </div>
            </div>
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