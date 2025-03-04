
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../game/scenes/MainScene';
import { HUD } from './HUD';
import { cn } from '@/lib/utils';

type GameCanvasProps = {
  className?: string;
  characterId?: string;
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ className, characterId = 'writer' }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);
  const [health, setHealth] = React.useState(100);
  const [energy, setEnergy] = React.useState(100);
  const [feedbackState, setFeedbackState] = React.useState<'neutral' | 'positive' | 'negative'>('neutral');

  // Initialize game
  useEffect(() => {
    if (gameContainerRef.current && !gameInstanceRef.current) {
      const mainScene = new MainScene({
        onHealthChange: (newHealth) => setHealth(newHealth),
        onEnergyChange: (newEnergy) => setEnergy(newEnergy),
        onFeedbackChange: (state) => setFeedbackState(state),
        characterId: characterId
      });

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainerRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 500 },
            debug: false
          }
        },
        scene: [mainScene],
        render: {
          pixelArt: true, // Enable pixel art mode for sharper retro graphics
          antialias: false, // Disable antialiasing for pixel art
          roundPixels: true // Better for pixel art rendering
        },
        backgroundColor: '#111111',
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      gameInstanceRef.current = new Phaser.Game(config);

      // Setup window resizing
      const handleResize = () => {
        if (gameInstanceRef.current) {
          const parent = gameContainerRef.current;
          if (parent) {
            const width = parent.clientWidth;
            const height = parent.clientHeight;
            gameInstanceRef.current.scale.resize(width, height);
          }
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        gameInstanceRef.current?.destroy(true);
        gameInstanceRef.current = null;
      };
    }
  }, [characterId]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div 
        ref={gameContainerRef} 
        className="w-full h-full"
      />
      <HUD health={health} energy={energy} feedbackState={feedbackState} />
    </div>
  );
};
