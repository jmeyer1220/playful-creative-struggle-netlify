
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../game/scenes/MainScene';
import { HUD } from './HUD';
import { cn } from '@/lib/utils';

type GameCanvasProps = {
  className?: string;
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ className }) => {
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
        onFeedbackChange: (state) => setFeedbackState(state)
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
          pixelArt: false,
          antialias: true
        },
        backgroundColor: '#111111'
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
  }, []);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <div 
        ref={gameContainerRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)' }}
      />
      <HUD health={health} energy={energy} feedbackState={feedbackState} />
    </div>
  );
};
