
import React from 'react';
import { cn } from '@/lib/utils';

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
          "absolute inset-0 transition-opacity duration-700 pointer-events-none", 
          feedbackState === 'positive' ? "bg-emerald-500/10" : "",
          feedbackState === 'negative' ? "bg-red-500/10" : "",
          feedbackState === 'neutral' ? "opacity-0" : "opacity-100"
        )}
      />
      
      {/* Health Bar */}
      <div className="absolute top-6 left-6 glass-panel p-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-white/90 uppercase tracking-wider">Health</div>
          <div className="h-2 w-36 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-300",
                health > 60 ? "bg-emerald-500" : health > 30 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${health}%` }}
            />
          </div>
          <div className="text-xs font-bold text-white/90">{health}</div>
        </div>
      </div>
      
      {/* Energy Bar */}
      <div className="absolute top-6 right-6 glass-panel p-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-white/90 uppercase tracking-wider">Energy</div>
          <div className="h-2 w-36 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${energy}%` }}
            />
          </div>
          <div className="text-xs font-bold text-white/90">{energy}</div>
        </div>
      </div>
    </div>
  );
};
