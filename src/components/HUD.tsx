import React from 'react';
import { cn } from '@/lib/utils';
import { Heart, Zap, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

type HUDProps = {
  health: number;
  energy: number;
  characterName: string;
  feedbackState: 'neutral' | 'positive' | 'negative';
};

export const HUD: React.FC<HUDProps> = ({ health, energy, characterName, feedbackState }) => {
  return (
    <div className="absolute inset-0 pointer-events-none font-mono">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-black/40 border-b border-cyan-500/30 flex items-center justify-between px-4">
        {/* Character Info - Left Side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <div className="text-cyan-400 text-sm tracking-wide">
              {characterName}
            </div>
          </div>
          
          {/* Health and Energy */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="text-red-400 text-xs">HP</div>
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(health / 20) }).map((_, i) => (
                  <div 
                    key={`health-${i}`} 
                    className={`h-3 w-3 border border-red-500 ${
                      i * 20 < health ? 'bg-red-500' : 'bg-red-500/20'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-purple-400 text-xs">EP</div>
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(energy / 20) }).map((_, i) => (
                  <div 
                    key={`energy-${i}`} 
                    className={`h-3 w-3 border border-purple-500 ${
                      i * 20 < energy ? 'bg-purple-500' : 'bg-purple-500/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Level Info - Right Side */}
        <div className="flex items-center gap-2">
          <div className="text-cyan-400/70 text-xs">LEVEL</div>
          <div className="text-cyan-400 text-sm tracking-wide">
            1: GRID PROTOCOL
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/40 border border-cyan-500/30 px-3 py-2">
          <div className="text-xs text-cyan-400/80 flex flex-col gap-1">
            <div>WASD/ARROWS - MOVE</div>
            <div>Z - ATTACK</div>
            <div>X - DASH</div>
          </div>
        </div>
      </div>

      {/* Feedback State */}
      {feedbackState && (
        <div className="absolute bottom-4 right-4">
          <div className={`px-3 py-2 border ${
            feedbackState === 'positive' 
              ? 'border-green-500/30 text-green-400'
              : 'border-red-500/30 text-red-400'
          }`}>
            {feedbackState === 'positive' ? 'FOCUSED' : 'DISRUPTED'}
          </div>
        </div>
      )}
    </div>
  );
};
