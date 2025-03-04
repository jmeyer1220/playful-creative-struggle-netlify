
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
          "absolute inset-0 transition-all duration-700 pointer-events-none", 
          feedbackState === 'positive' ? "bg-purple-500/15 shadow-inner shadow-purple-300/20" : "",
          feedbackState === 'negative' ? "bg-red-500/15 shadow-inner shadow-red-300/20" : "",
          feedbackState === 'neutral' ? "opacity-0" : "opacity-100"
        )}
      />
      
      {/* Performance Status */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 glass-panel p-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium tracking-wider",
              feedbackState === 'positive' ? "bg-purple-500/70 text-white" : "",
              feedbackState === 'negative' ? "bg-red-500/70 text-white" : "",
              feedbackState === 'neutral' ? "bg-white/20 text-white/80" : ""
            )}
          >
            {feedbackState === 'positive' && "IN THE FLOW"}
            {feedbackState === 'negative' && "STRUGGLING"}
            {feedbackState === 'neutral' && "FOCUSED"}
          </div>
        </div>
      </div>
      
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
      
      {/* Status Effects (only shown when active) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel p-3 rounded-lg shadow-lg" 
           style={{ opacity: feedbackState !== 'neutral' ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
        <div className="flex items-center gap-4 justify-center">
          {feedbackState === 'positive' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-xs text-white/90">Speed +20%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-xs text-white/90">Dash -20% Cooldown</span>
              </div>
            </>
          )}
          
          {feedbackState === 'negative' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-xs text-white/90">Speed -10%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                <span className="text-xs text-white/90">Dash +20% Cooldown</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
