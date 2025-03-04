import { FeedbackLevel, PerformanceStats, PlayerBuffs } from './types';

export class PerformanceTracker {
  private performanceScore: number = 50; // 0-100, start at middle
  private hitStreak: number = 0;
  private timeSinceLastHit: number = 0;
  private recentDamageTaken: number = 0;
  private currentLevel: FeedbackLevel = 'neutral';

  constructor() {
    // Initialize default values
  }

  public reset(): void {
    this.performanceScore = 50;
    this.hitStreak = 0;
    this.timeSinceLastHit = 0;
    this.recentDamageTaken = 0;
    this.currentLevel = 'neutral';
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
  }

  public getStats(): PerformanceStats {
    return {
      hitStreak: this.hitStreak,
      timeSinceLastHit: this.timeSinceLastHit,
      damageTaken: this.recentDamageTaken,
      performanceScore: this.performanceScore
    };
  }

  public getFeedbackLevel(): FeedbackLevel {
    return this.currentLevel;
  }
  
  public getPerformanceScore(): number {
    return this.performanceScore;
  }
  
  // Get player buffs based on performance
  public getPlayerBuffs(): PlayerBuffs {
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
