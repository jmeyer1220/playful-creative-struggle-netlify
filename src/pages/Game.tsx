
import { GameCanvas } from "@/components/GameCanvas";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Game = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Game Canvas - Now takes nearly full screen */}
      <div className="flex-1 relative">
        <GameCanvas className="w-full h-full" />
        
        {/* Overlay Controls Info - Now as a semi-transparent overlay */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="glass-panel p-3 rounded-lg text-sm text-white/90 shadow-lg backdrop-blur-md">
            <div className="font-semibold mb-1">Controls:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              <div>→ / ←: Move</div>
              <div>↑: Jump (Double Jump)</div>
              <div>Z: Attack</div>
              <div>X: Dash</div>
            </div>
          </div>
        </div>
        
        {/* Back Button - Now as a semi-transparent overlay */}
        <Link to="/" className="absolute top-4 left-4 z-10">
          <Button variant="outline" size="sm" className="glass-panel backdrop-blur-md border border-white/10 hover:border-white/30 text-white/90 hover:text-white">
            <Home className="mr-2 h-4 w-4" />
            Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Game;
