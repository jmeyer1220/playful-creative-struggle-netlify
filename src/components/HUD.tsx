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
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Left: Health and Energy */}
      <div className="absolute top-4 left-4 flex gap-2">
        {/* Health Hearts */}
        <div className="flex gap-1">
          {Array.from({ length: Math.ceil(health / 25) }).map((_, i) => (
            <div 
              key={`heart-${i}`} 
              className={`w-8 h-8 relative ${i * 25 + 25 <= health ? 'opacity-100' : 'opacity-50'}`}
            >
              <div className="absolute inset-0 pixel-art-heart animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Energy Crystals */}
        <div className="flex gap-1 ml-4">
          {Array.from({ length: Math.ceil(energy / 25) }).map((_, i) => (
            <div 
              key={`energy-${i}`}
              className={`w-6 h-6 relative ${i * 25 + 25 <= energy ? 'opacity-100' : 'opacity-30'}`}
            >
              <div className="absolute inset-0 pixel-art-crystal animate-glow" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Left: Controls (only show briefly or on pause) */}
      <div className="absolute bottom-4 left-4 pixel-panel bg-black/80 border-2 border-cyan-500/30 p-2">
        <div className="text-[10px] font-pixel text-cyan-300/90 flex flex-col gap-1">
          <div>WASD/↑←↓→: MOVE</div>
          <div>Z: ATTACK</div>
          <div>X: DASH</div>
        </div>
      </div>

      {/* Top Right: Level Info */}
      <div className="absolute top-4 right-4 pixel-panel bg-black/80 border-2 border-cyan-500/30 p-2">
        <div className="text-sm font-pixel text-cyan-300/90">LEVEL 1: GRID PROTOCOL</div>
      </div>
    </div>
  );
};
