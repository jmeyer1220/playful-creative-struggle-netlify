import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from "sonner";
import { characters, CharacterType } from '@/data/characters';

interface CharacterSelectProps {
  onSelectCharacter: (character: CharacterType) => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelectCharacter }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const selectedCharacter = characters[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
  };

  const handleSelect = () => {
    onSelectCharacter(selectedCharacter);
    toast.success(`Selected ${selectedCharacter.name}!`);
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="p-6 flex justify-between items-center">
        <Link to="/">
          <Button variant="outline" className="glass-panel backdrop-blur-md border border-white/10 hover:border-white/30 text-white/90 hover:text-white">
            <Home className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </Link>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Choose Your Creative
        </h1>
        <div className="w-[100px]"></div> {/* Empty div for layout balance */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Character Selection Carousel */}
        <div className="relative w-full max-w-4xl flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 z-10 glass-panel h-12 w-12 rounded-full"
            onClick={handlePrevious}
          >
            <ArrowLeft />
          </Button>
          
          <div className="glass-panel p-8 w-full max-w-2xl rounded-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Character Avatar */}
              <div className={`${selectedCharacter.color} w-40 h-40 rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-5xl opacity-75">
                  {selectedCharacter.name.charAt(0)}
                </span>
              </div>
              
              {/* Character Info */}
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold">{selectedCharacter.name}</h2>
                <p className="text-white/70">{selectedCharacter.description}</p>
                
                <div>
                  <h3 className="text-sm text-white/50 mb-2">ABILITIES</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.abilities.map((ability) => (
                      <span 
                        key={ability} 
                        className="px-3 py-1 rounded-full bg-white/10 text-sm"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 z-10 glass-panel h-12 w-12 rounded-full"
            onClick={handleNext}
          >
            <ArrowRight />
          </Button>
        </div>
        
        {/* Character Selection Indicators */}
        <div className="flex gap-2 justify-center">
          {characters.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${selectedIndex === index ? 'bg-white' : 'bg-white/30'}`}
              onClick={() => setSelectedIndex(index)}
            ></div>
          ))}
        </div>
        
        {/* Start Button */}
        <Button 
          className="mt-6 h-14 px-8 text-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 border-0 text-white shadow-lg transition-all duration-300 group rounded-lg"
          onClick={handleSelect}
        >
          Begin Journey
          <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Version number */}
      <div className="p-4 text-right">
        <span className="text-xs text-white/30">v0.1.0 Prototype</span>
      </div>
    </div>
  );
};

export default CharacterSelect;
