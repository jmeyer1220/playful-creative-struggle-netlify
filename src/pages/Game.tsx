import { GameCanvas } from "@/components/GameCanvas";
import { CharacterType } from "@/data/characters";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface GameProps {
  selectedCharacter: CharacterType | null;
}

const Game: React.FC<GameProps> = ({ selectedCharacter }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedCharacter) {
      toast.error("No character selected! Redirecting to character selection.");
      navigate('/character-select');
    }
  }, [selectedCharacter, navigate]);

  if (!selectedCharacter) return null;

  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
      {/* Game Canvas */}
      <div className="flex-1 relative">
        <GameCanvas 
          className="w-full h-full" 
          characterId={selectedCharacter.id} 
        />
        
        {/* Grid Overlay */}
        {/*<div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-32 grid-rows-24 opacity-10">
            {Array.from({ length: 768 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/10"></div>
            ))}
          </div>
        </div>*}
        
        {/* Character info overlay */}
      </div>
    </div>
  );
};

export default Game;
