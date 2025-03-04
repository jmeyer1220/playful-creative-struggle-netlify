import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';

export const MainMenu: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-gray-900">
      {/* Title and Subtitle */}
      <div className="text-center mb-12">
        <div className="relative mb-3">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20"></div>
          <h1 className="relative text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Creative Struggle
          </h1>
        </div>
        <p className="text-muted-foreground text-lg animate-fade-in">
          A journey through the mind's creative process
        </p>
      </div>
      
      {/* Menu Options */}
      <div className="flex flex-col gap-4 w-full max-w-xs animate-fade-in">
        <Link to="/character-select" className="w-full">
          <Button 
            className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 border-0 text-white shadow-lg transition-all duration-300 group rounded-lg"
          >
            <Play className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Start Journey
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          className="w-full h-14 text-lg group glass-panel backdrop-blur-md border border-white/10 hover:border-white/30 text-white/90 hover:text-white"
        >
          <span>How to Play</span>
          <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full h-14 text-lg group glass-panel backdrop-blur-md border border-white/10 hover:border-white/30 text-white/90 hover:text-white"
        >
          <span>About</span>
          <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-48 h-48 rounded-full bg-blue-500/10 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-2/3 -right-32 w-64 h-64 rounded-full bg-purple-500/10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-pink-500/10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Version number */}
      <div className="absolute bottom-4 right-4 text-xs text-white/30">
        v0.1.0 Prototype
      </div>
    </div>
  );
};
