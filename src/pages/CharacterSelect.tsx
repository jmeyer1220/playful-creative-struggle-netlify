
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ChevronRight } from 'lucide-react';
import { toast } from "sonner";
import { characters, CharacterType } from '@/data/characters';

interface CharacterSelectProps {
  onSelectCharacter: (character: CharacterType) => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelectCharacter }) => {
  const [hoveredCharacter, setHoveredCharacter] = useState<CharacterType | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);
  const navigate = useNavigate();

  const handleSelect = () => {
    if (selectedCharacter) {
      onSelectCharacter(selectedCharacter);
      toast.success(`Selected ${selectedCharacter.name}!`);
      navigate('/game');
    } else {
      toast.error("Please select a character first!");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white relative overflow-hidden">
      {/* Studio/Gallery Background */}
      <div className="absolute inset-0 bg-[url('/lovable-uploads/282328c2-2e0e-4f71-ba29-863383df04a0.png')] bg-cover bg-center opacity-10 z-0"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <Link to="/">
          <Button variant="outline" className="glass-panel backdrop-blur-md border border-white/10 hover:border-white/30 text-white/90 hover:text-white">
            <Home className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </Link>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          The Creative Studio
        </h1>
        <div className="w-[100px]"></div>
      </div>

      {/* Character Studio/Gallery Space */}
      <div className="relative z-10 flex-1 h-[70vh] grid place-items-center">
        <div className="w-full max-w-4xl h-[500px] relative bg-black/40 backdrop-blur-sm rounded-xl border border-white/5 shadow-xl overflow-hidden">
          {/* Studio Floor Grid */}
          <div className="absolute inset-0 bg-[#221F26] bg-opacity-50">
            <div className="w-full h-full grid grid-cols-12 grid-rows-8">
              {Array.from({ length: 96 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/5"></div>
              ))}
            </div>
          </div>

          {/* Character Sprites */}
          {characters.map((character, index) => {
            // Generate positions based on index for a scattered layout
            const positions = [
              { top: '25%', left: '20%' },
              { top: '60%', left: '30%' },
              { top: '15%', left: '50%' },
              { top: '70%', left: '75%' },
              { top: '40%', left: '80%' },
              { top: '65%', left: '15%' },
              { top: '35%', left: '65%' },
              { top: '20%', left: '75%' },
              { top: '50%', left: '40%' },
              { top: '75%', left: '55%' }
            ];
            const pos = positions[index % positions.length];
            
            return (
              <div 
                key={character.id}
                className={`absolute cursor-pointer transition-all duration-300 ${selectedCharacter?.id === character.id ? 'scale-125 z-20' : 'hover:scale-110 z-10'}`}
                style={{ top: pos.top, left: pos.left }}
                onMouseEnter={() => setHoveredCharacter(character)}
                onMouseLeave={() => setHoveredCharacter(null)}
                onClick={() => setSelectedCharacter(character)}
              >
                {/* Character Avatar Circle */}
                <div className={`${character.color} w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 ${selectedCharacter?.id === character.id ? 'border-white animate-pulse' : 'border-transparent'}`}>
                  <span className="text-2xl opacity-75 pointer-events-none">
                    {character.name.charAt(0)}
                  </span>
                </div>
                
                {/* Name Tag Below Character */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold text-white/80">
                  {character.name}
                </div>
              </div>
            );
          })}
          
          {/* Selection Info Panel - Fixed at bottom */}
          <div className={`absolute bottom-0 left-0 right-0 glass-panel p-4 transition-all duration-300 transform ${(hoveredCharacter || selectedCharacter) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {(hoveredCharacter || selectedCharacter) && (
              <div className="flex items-start gap-3">
                {/* Character Icon */}
                <div className={`${(hoveredCharacter || selectedCharacter)?.color} w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-3xl opacity-75">
                    {(hoveredCharacter || selectedCharacter)?.name.charAt(0)}
                  </span>
                </div>
                
                {/* Character Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{(hoveredCharacter || selectedCharacter)?.name}</h2>
                  <p className="text-white/70 text-sm">{(hoveredCharacter || selectedCharacter)?.description}</p>
                  
                  {/* Abilities */}
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(hoveredCharacter || selectedCharacter)?.abilities.map((ability) => (
                        <span key={ability} className="px-2 py-1 rounded-full bg-white/10 text-xs">
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Select Button (only for hovered but not yet selected character) */}
                {hoveredCharacter && hoveredCharacter.id !== selectedCharacter?.id && (
                  <Button 
                    className="bg-white/10 hover:bg-white/20 border border-white/30 text-white"
                    onClick={() => setSelectedCharacter(hoveredCharacter)}
                    size="sm"
                  >
                    Select
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Action Area */}
      <div className="relative z-10 flex justify-center mt-6 pb-8">
        <Button 
          className={`h-14 px-8 text-lg transition-all duration-300 group rounded-lg ${selectedCharacter 
            ? 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 opacity-100'
            : 'bg-gray-700 opacity-50 cursor-not-allowed'}`}
          onClick={handleSelect}
          disabled={!selectedCharacter}
        >
          Begin Journey
          <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Version number */}
      <div className="relative z-10 p-4 text-right">
        <span className="text-xs text-white/30">v0.1.0 Prototype</span>
      </div>
    </div>
  );
};

export default CharacterSelect;
