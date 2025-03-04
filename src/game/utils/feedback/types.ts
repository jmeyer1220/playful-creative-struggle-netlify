
// Common types used across the adaptive feedback system
export type FeedbackLevel = 'struggling' | 'neutral' | 'excelling';

export type PerformanceStats = {
  hitStreak: number;
  timeSinceLastHit: number;
  damageTaken: number;
  performanceScore: number;
};

export type PlayerBuffs = {
  speedMultiplier: number;
  dashCooldownMultiplier: number;
};
