
import Phaser from 'phaser';
import { FeedbackLevel, PerformanceStats, PlayerBuffs } from './feedback/types';
import { interpolateColors, applyBackgroundColor } from './feedback/colorUtils';
import { ParticleManager } from './feedback/particleManager';
import { PerformanceTracker } from './feedback/performanceTracker';

export { FeedbackLevel, PerformanceStats } from './feedback/types';

export class AdaptiveFeedbackManager {
  private scene: Phaser.Scene;
  private performanceTracker: PerformanceTracker;
  private particleManager: ParticleManager;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.performanceTracker = new PerformanceTracker();
    this.particleManager = new ParticleManager(scene);
  }
  
  public reset(): void {
    this.performanceTracker.reset();
    this.particleManager.reset();
  }
  
  public registerHit(): void {
    this.performanceTracker.registerHit();
    this.updateFeedback();
  }
  
  public registerDamageTaken(amount: number): void {
    this.performanceTracker.registerDamageTaken(amount);
    this.updateFeedback();
  }
  
  public update(delta: number): void {
    this.performanceTracker.update(delta);
    this.applyVisualEffects();
  }
  
  private updateFeedback(): void {
    const currentLevel = this.performanceTracker.getFeedbackLevel();
    this.particleManager.updateEmitters(currentLevel);
  }
  
  public applyVisualEffects(): void {
    const score = this.performanceTracker.getPerformanceScore();
    const targetColor = interpolateColors(score);
    applyBackgroundColor(this.scene, targetColor);
  }
  
  public setParticleTarget(target: Phaser.GameObjects.Components.Transform): void {
    this.particleManager.setTarget(target);
  }
  
  public getFeedbackLevel(): FeedbackLevel {
    return this.performanceTracker.getFeedbackLevel();
  }
  
  public getPerformanceScore(): number {
    return this.performanceTracker.getPerformanceScore();
  }
  
  public getPerformanceStats(): PerformanceStats {
    return this.performanceTracker.getStats();
  }
  
  public getPlayerBuffs(): PlayerBuffs {
    return this.performanceTracker.getPlayerBuffs();
  }
}
