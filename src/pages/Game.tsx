
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
      {/* Game Canvas - Takes full screen */}
      <div className="flex-1 relative">
        <GameCanvas 
          className="w-full h-full" 
          characterId={selectedCharacter.id} 
        />
      </div>

      {/* Character info overlay */}
      <div className="absolute top-2 left-2 glass-panel rounded-lg px-3 py-1.5 text-sm text-white/80 flex items-center gap-2">
        <div className={`${selectedCharacter.color} size-3 rounded-full`}></div>
        <span>{selectedCharacter.name}</span>
      </div>
    </div>
  );
};

export default Game;
