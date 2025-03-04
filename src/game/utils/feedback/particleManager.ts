
import Phaser from 'phaser';
import { FeedbackLevel } from './types';

export class ParticleManager {
  private scene: Phaser.Scene;
  private excelEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private struggleEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initialize();
  }

  private initialize(): void {
    // Initialize particle system if the texture exists
    if (this.scene.textures.exists('particle')) {
      this.createParticleEmitters();
    }
  }

  private createParticleEmitters(): void {
    // Positive feedback particles (colorful, energetic)
    this.excelEmitter = this.scene.add.particles(0, 0, 'particle', {
      lifespan: 800,
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      quantity: 1,
      blendMode: Phaser.BlendModes.ADD,
      tint: [0xD946EF, 0x8B5CF6, 0xF97316], // Vibrant colors
      active: false
    });
    
    // Negative feedback particles (slower, darker)
    this.struggleEmitter = this.scene.add.particles(0, 0, 'particle', {
      lifespan: 1200,
      speed: { min: 20, max: 40 },
      scale: { start: 0.3, end: 0 },
      quantity: 1,
      blendMode: Phaser.BlendModes.MULTIPLY,
      tint: [0x1A1F2C, 0x222222, 0x403E43], // Dark colors
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

  public setTarget(target: Phaser.GameObjects.Components.Transform): void {
    if (this.excelEmitter) {
      this.excelEmitter.setPosition(target.x, target.y);
      this.excelEmitter.startFollow(target);
    }
    
    if (this.struggleEmitter) {
      this.struggleEmitter.setPosition(target.x, target.y);
      this.struggleEmitter.startFollow(target);
    }
  }

  public reset(): void {
    if (this.excelEmitter) this.excelEmitter.stop();
    if (this.struggleEmitter) this.struggleEmitter.stop();
  }
}
