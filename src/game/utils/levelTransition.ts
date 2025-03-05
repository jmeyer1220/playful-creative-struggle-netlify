export class LevelTransition {
  async transitionTo(nextLevel: string) {
    const currentTheme = CREATIVE_JOURNEY_LEVELS[this.currentLevel];
    const nextTheme = CREATIVE_JOURNEY_LEVELS[nextLevel];
    
    // Fade out current level
    await this.fadeOutLevel(currentTheme);
    
    // Transition background colors
    await this.transitionBackground(currentTheme.backgroundColor, nextTheme.backgroundColor);
    
    // Morph grid patterns
    await this.morphGridPatterns(currentTheme.gridColor, nextTheme.gridColor);
    
    // Fade in new level
    await this.fadeInLevel(nextTheme);
  }
} 