
import Phaser from 'phaser';

export type FeedbackLevel = 'struggling' | 'neutral' | 'excelling';
export type PerformanceStats = {
  hitStreak: number;
  timeSinceLastHit: number;
  damageTaken: number;
  performanceScore: number;
};

export class AdaptiveFeedbackManager {
  private scene: Phaser.Scene;
  private performanceScore: number = 50; // 0-100, start at middle
  private hitStreak: number = 0;
  private timeSinceLastHit: number = 0;
  private recentDamageTaken: number = 0;
  private currentLevel: FeedbackLevel = 'neutral';
  private particles: Phaser.GameObjects.Particles.ParticleEmitterManager | null = null;
  private excelEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private struggleEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  
  // Background colors for interpolation
  private readonly STRUGGLE_COLOR = new Phaser.Display.Color(40, 30, 60); // Dark purple
  private readonly NEUTRAL_COLOR = new Phaser.Display.Color(60, 60, 70); // Neutral gray
  private readonly EXCEL_COLOR = new Phaser.Display.Color(100, 40, 140); // Vibrant purple

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // Initialize particle system if the texture exists
    if (scene.textures.exists('particle')) {
      // Use correct typing for particle manager in Phaser v3.70+
      this.particles = scene.add.particles(0, 0, 'particle') as unknown as Phaser.GameObjects.Particles.ParticleEmitterManager;
      
      // Create particle emitters (initially disabled)
      this.createParticleEmitters();
    }
  }

  private createParticleEmitters() {
    if (!this.particles) return;
    
    // Positive feedback particles (colorful, energetic)
    this.excelEmitter = this.particles.createEmitter({
      lifespan: 800,
      speed: { min: 50, max: 100 },
      scale: { start: 0.4, end: 0 },
      quantity: 1,
      blendMode: Phaser.BlendModes.ADD,
      tint: [0xD946EF, 0x8B5CF6, 0xF97316], // Vibrant colors
      on: false
    });
    
    // Negative feedback particles (slower, darker)
    this.struggleEmitter = this.particles.createEmitter({
      lifespan: 1200,
      speed: { min: 20, max: 40 },
      scale: { start: 0.3, end: 0 },
      quantity: 1,
      blendMode: Phaser.BlendModes.MULTIPLY,
      tint: [0x1A1F2C, 0x222222, 0x403E43], // Dark colors
      gravityY: 20,
      on: false
    });
  }
  
  public reset(): void {
    this.performanceScore = 50;
    this.hitStreak = 0;
    this.timeSinceLastHit = 0;
    this.recentDamageTaken = 0;
    this.currentLevel = 'neutral';
    
    // Disable particle emitters
    if (this.excelEmitter) this.excelEmitter.active = false;
    if (this.struggleEmitter) this.struggleEmitter.active = false;
  }
  
  public registerHit(): void {
    this.hitStreak++;
    this.timeSinceLastHit = 0;
    
    // Increase performance score (capped at 100)
    this.performanceScore = Math.min(100, this.performanceScore + 5 + Math.min(5, this.hitStreak));
    
    this.updateFeedbackLevel();
  }
  
  public registerDamageTaken(amount: number): void {
    this.hitStreak = 0; // Reset hit streak
    this.recentDamageTaken += amount;
    
    // Decrease performance score (minimum 0)
    this.performanceScore = Math.max(0, this.performanceScore - (amount * 3));
    
    this.updateFeedbackLevel();
  }
  
  public update(delta: number): void {
    // Increment time since last hit
    this.timeSinceLastHit += delta;
    
    // Gradually return to neutral if no hits for a while
    if (this.timeSinceLastHit > 2000) {
      this.hitStreak = Math.max(0, this.hitStreak - 1);
      
      // Slowly return to neutral (50)
      if (this.performanceScore > 50) {
        this.performanceScore = Math.max(50, this.performanceScore - 0.1);
      } else if (this.performanceScore < 50) {
        this.performanceScore = Math.min(50, this.performanceScore + 0.1);
      }
      
      // Reset damage counter over time
      this.recentDamageTaken = Math.max(0, this.recentDamageTaken - 0.1);
      
      this.updateFeedbackLevel();
    }
    
    // Apply visual effects based on current feedback level
    this.applyVisualEffects();
  }
  
  private updateFeedbackLevel(): void {
    const oldLevel = this.currentLevel;
    
    // Determine feedback level based on performance score
    if (this.performanceScore >= 70) {
      this.currentLevel = 'excelling';
    } else if (this.performanceScore <= 30) {
      this.currentLevel = 'struggling';
    } else {
      this.currentLevel = 'neutral';
    }
    
    // Only trigger events if the level has changed
    if (oldLevel !== this.currentLevel) {
      this.onFeedbackLevelChanged();
    }
  }
  
  private onFeedbackLevelChanged(): void {
    // Toggle appropriate particle emitters
    if (this.excelEmitter) {
      this.excelEmitter.active = (this.currentLevel === 'excelling');
    }
    
    if (this.struggleEmitter) {
      this.struggleEmitter.active = (this.currentLevel === 'struggling');
    }
  }
  
  public applyVisualEffects(): void {
    // Interpolate background color based on performance
    let targetColor: Phaser.Display.Color;
    let progress: number;
    
    if (this.performanceScore >= 50) {
      // Between neutral and excelling
      progress = (this.performanceScore - 50) / 50; // 0 to 1
      const interpolatedColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        this.NEUTRAL_COLOR,
        this.EXCEL_COLOR,
        1,
        progress
      );
      
      targetColor = new Phaser.Display.Color(
        interpolatedColor.r, 
        interpolatedColor.g, 
        interpolatedColor.b
      );
    } else {
      // Between struggling and neutral
      progress = this.performanceScore / 50; // 0 to 1
      const interpolatedColor = Phaser.Display.Color.Interpolate.ColorWithColor(
        this.STRUGGLE_COLOR,
        this.NEUTRAL_COLOR,
        1,
        progress
      );
      
      targetColor = new Phaser.Display.Color(
        interpolatedColor.r, 
        interpolatedColor.g, 
        interpolatedColor.b
      );
    }
    
    // Apply color to the background
    const color = Phaser.Display.Color.GetColor(
      targetColor.red, 
      targetColor.green, 
      targetColor.blue
    );
    this.scene.cameras.main.setBackgroundColor(color);
  }
  
  public setParticleTarget(target: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.GameObject): void {
    if (this.excelEmitter) {
      this.excelEmitter.startFollow(target);
    }
    
    if (this.struggleEmitter) {
      this.struggleEmitter.startFollow(target);
    }
  }
  
  public getFeedbackLevel(): FeedbackLevel {
    return this.currentLevel;
  }
  
  public getPerformanceScore(): number {
    return this.performanceScore;
  }
  
  public getPerformanceStats(): PerformanceStats {
    return {
      hitStreak: this.hitStreak,
      timeSinceLastHit: this.timeSinceLastHit,
      damageTaken: this.recentDamageTaken,
      performanceScore: this.performanceScore
    };
  }
  
  // Get player buffs based on performance
  public getPlayerBuffs(): { speedMultiplier: number, dashCooldownMultiplier: number } {
    // Default values (no buff/debuff)
    let speedMultiplier = 1.0;
    let dashCooldownMultiplier = 1.0;
    
    // Apply buffs based on performance
    if (this.performanceScore >= 70) {
      // When excelling, player moves faster and dash recharges quicker
      speedMultiplier = 1.2;
      dashCooldownMultiplier = 0.8;
    } else if (this.performanceScore <= 30) {
      // When struggling, player moves slightly slower and dash takes longer to recharge
      speedMultiplier = 0.9;
      dashCooldownMultiplier = 1.2;
    }
    
    return { speedMultiplier, dashCooldownMultiplier };
  }
}
