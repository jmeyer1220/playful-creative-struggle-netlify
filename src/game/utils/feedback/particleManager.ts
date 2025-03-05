import Phaser from 'phaser';
import { FeedbackLevel } from './types';

export class ParticleManager {
  private scene: Phaser.Scene;
  private target: Phaser.GameObjects.Components.Transform | null = null;
  private excelEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private struggleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createParticleEmitters();
  }

  public setTarget(target: Phaser.GameObjects.Components.Transform): void {
    this.target = target;
    this.excelEmitter.setPosition(target.x, target.y);
    this.struggleEmitter.setPosition(target.x, target.y);
    
    // Make emitters follow the target
    this.excelEmitter.followOffset.set(0, 0);
    this.struggleEmitter.followOffset.set(0, 0);
    this.excelEmitter.follow(target);
    this.struggleEmitter.follow(target);
  }

  private createParticleEmitters(): void {
    this.excelEmitter = this.scene.add.particles(0, 0, 'particle', {
      follow: null,
      lifespan: 800,
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      quantity: 1,
      blendMode: Phaser.BlendModes.ADD,
      tint: [0xD946EF, 0x8B5CF6, 0xF97316],
      active: false
    });
    
    this.struggleEmitter = this.scene.add.particles(0, 0, 'particle', {
      follow: null,
      lifespan: 1200,
      speed: { min: 20, max: 40 },
      scale: { start: 0.3, end: 0 },
      quantity: 1,
      blendMode: Phaser.BlendModes.MULTIPLY,
      tint: [0x1A1F2C, 0x222222, 0x403E43],
      gravityY: 20,
      active: false
    });
  }

  public updateEmitters(feedbackLevel: FeedbackLevel): void {
    if (this.excelEmitter) {
      if (feedbackLevel === 'excelling') {
        this.excelEmitter.start();
      } else {
        this.excelEmitter.stop();
      }
    }
    
    if (this.struggleEmitter) {
      if (feedbackLevel === 'struggling') {
        this.struggleEmitter.start();
      } else {
        this.struggleEmitter.stop();
      }
    }
  }

  public reset(): void {
    if (this.excelEmitter) this.excelEmitter.stop();
    if (this.struggleEmitter) this.struggleEmitter.stop();
  }
}
