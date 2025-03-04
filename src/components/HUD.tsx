
import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, Zap, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

type HUDProps = {
  health: number;
  energy: number;
  feedbackState: 'neutral' | 'positive' | 'negative';
};

export const HUD: React.FC<HUDProps> = ({ health, energy, feedbackState }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* Feedback Overlay */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-700 pointer-events-none", 
          feedbackState === 'positive' ? "bg-purple-500/10 shadow-inner shadow-purple-300/20" : "",
          feedbackState === 'negative' ? "bg-red-500/10 shadow-inner shadow-red-300/20" : "",
          feedbackState === 'neutral' ? "opacity-0" : "opacity-100"
        )}
      />
      
      {/* Top Left: Health Bar in Gungeon Style */}
      <div className="absolute top-3 left-3">
        <Link to="/" className="pointer-events-auto">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-black/70 border border-gray-700">
            <Home className="h-4 w-4 text-gray-400" />
            <div className="text-xs font-bold text-gray-300 uppercase mx-1">Menu</div>
          </div>
        </Link>
        <div className="flex items-center mt-2 bg-black/70 border border-gray-700 px-3 py-1.5 rounded-md">
          <Heart className="h-4 w-4 text-red-500 mr-2" />
          <div className="w-32 h-3 bg-gray-900 rounded-sm overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-sm transition-all duration-300",
                health > 60 ? "bg-red-500" : health > 30 ? "bg-orange-500" : "bg-red-700"
              )}
              style={{ width: `${health}%` }}
            />
          </div>
          <div className="text-xs font-bold text-gray-300 ml-2">{health}</div>
        </div>
      </div>
      
      {/* Top Right: Energy Bar in Gungeon Style */}
      <div className="absolute top-3 right-3">
        <div className="flex items-center bg-black/70 border border-gray-700 px-3 py-1.5 rounded-md">
          <div className="text-xs font-bold text-gray-300 mr-2">ENERGY</div>
          <div className="w-32 h-3 bg-gray-900 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-sm transition-all duration-300"
              style={{ width: `${energy}%` }}
            />
          </div>
          <div className="text-xs font-bold text-gray-300 ml-2">{energy}</div>
        </div>
      </div>
      
      {/* Center Top: Feedback Status */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2">
        <div className={cn(
          "px-4 py-1.5 rounded-md bg-black/70 border border-gray-700",
          feedbackState === 'positive' ? "border-purple-600" : "",
          feedbackState === 'negative' ? "border-red-600" : "",
        )}>
          <div 
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              feedbackState === 'positive' ? "text-purple-400" : "",
              feedbackState === 'negative' ? "text-red-400" : "",
              feedbackState === 'neutral' ? "text-gray-400" : ""
            )}
          >
            {feedbackState === 'positive' && "IN THE FLOW"}
            {feedbackState === 'negative' && "STRUGGLING"}
            {feedbackState === 'neutral' && "FOCUSED"}
          </div>
        </div>
      </div>
      
      {/* Bottom Left: Controls */}
      <div className="absolute bottom-3 left-3">
        <div className="bg-black/70 border border-gray-700 px-3 py-2 rounded-md">
          <div className="text-xs font-medium text-gray-400 mb-1">Controls:</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-gray-300">
            <div>→ / ←: Move</div>
            <div>↑: Jump (Double Jump)</div>
            <div>Z: Attack</div>
            <div>X: Dash</div>
          </div>
        </div>
      </div>
      
      {/* Bottom Right: Status Effects */}
      <div className="absolute bottom-3 right-3" 
           style={{ opacity: feedbackState !== 'neutral' ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
        <div className="bg-black/70 border border-gray-700 px-3 py-2 rounded-md">
          <div className="flex flex-col gap-1">
            {feedbackState === 'positive' && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-[10px] text-green-300">Speed +20%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-[10px] text-blue-300">Dash -20% Cooldown</span>
                </div>
              </>
            )}
            
            {feedbackState === 'negative' && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-[10px] text-red-300">Speed -10%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <span className="text-[10px] text-orange-300">Dash +20% Cooldown</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
