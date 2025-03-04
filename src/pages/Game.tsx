
import { GameCanvas } from "@/components/GameCanvas";
import { Link } from "react-router-dom";

const Game = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
      {/* Game Canvas - Takes full screen */}
      <div className="flex-1 relative">
        <GameCanvas className="w-full h-full" />
      </div>
    </div>
  );
};

export default Game;
