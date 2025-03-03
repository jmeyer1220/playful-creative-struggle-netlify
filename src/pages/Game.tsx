
import { GameCanvas } from "@/components/GameCanvas";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Game = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      {/* Game Canvas */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-4xl h-[600px] rounded-lg overflow-hidden shadow-2xl">
          <GameCanvas className="w-full h-full" />
        </div>
      </div>
      
      {/* Controls Info */}
      <div className="p-6 flex justify-between items-center">
        <div className="glass-panel p-4 rounded-lg text-sm text-white/80">
          <div className="font-semibold mb-2">Controls:</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <div>Arrow Keys: Move</div>
            <div>Up: Jump (Double Jump)</div>
            <div>Z: Attack</div>
            <div>X: Dash</div>
          </div>
        </div>
        
        <Link to="/">
          <Button variant="outline" className="glass-panel backdrop-blur-md border border-white/10 hover:border-white/30 text-white/90 hover:text-white">
            <Home className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Game;
