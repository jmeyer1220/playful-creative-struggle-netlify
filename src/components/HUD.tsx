import React from 'react';
import { cn } from '@/lib/utils';

type HUDProps = {
  health: number;
  inspiration: number; // renamed from energy
  characterName: string;
  feedbackState: 'neutral' | 'positive' | 'negative';
};

export const HUD: React.FC<HUDProps> = ({ health, inspiration, characterName, feedbackState }) => {
  return (
    <div className="absolute inset-0 pointer-events-none font-['Fira_Code']">
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
          
          {/* Health and Inspiration */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="text-red-400 text-xs">VITALITY</div>
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
              <div className="text-purple-400 text-xs">INSPIRATION</div>
              <div className="flex gap-1">
                {Array.from({ length: Math.ceil(inspiration / 20) }).map((_, i) => (
                  <div 
                    key={`inspiration-${i}`} 
                    className={`h-3 w-3 border border-purple-500 ${
                      i * 20 < inspiration ? 'bg-purple-500' : 'bg-purple-500/20'
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

      {/* Creative State Feedback */}
      {feedbackState !== 'neutral' && (
        <div className="absolute bottom-4 right-4">
          <div className={cn(
            "px-3 py-2 border",
            feedbackState === 'positive' 
              ? 'border-green-500/30 text-green-400'
              : 'border-red-500/30 text-red-400'
          )}>
            {feedbackState === 'positive' ? 'IN THE FLOW' : 'CREATIVE BLOCK'}
          </div>
        </div>
      )}

      {/* Status Effects */}
      <div 
        className="absolute bottom-16 right-4" 
        style={{ opacity: feedbackState !== 'neutral' ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
      >
        <div className="bg-black/70 border border-gray-700 px-3 py-2 rounded-md">
          {feedbackState === 'positive' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-[10px] text-green-300">Creative Flow +20%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-[10px] text-blue-300">Inspiration Gain +20%</span>
              </div>
            </>
          )}
          
          {feedbackState === 'negative' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-[10px] text-red-300">Creative Flow -10%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span className="text-[10px] text-orange-300">Inspiration Drain +20%</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
