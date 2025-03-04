
import Phaser from 'phaser';

// Background colors for interpolation
export const COLORS = {
  STRUGGLE: new Phaser.Display.Color(40, 30, 60), // Dark purple
  NEUTRAL: new Phaser.Display.Color(60, 60, 70),  // Neutral gray
  EXCEL: new Phaser.Display.Color(100, 40, 140)   // Vibrant purple
};

export function interpolateColors(
  performanceScore: number
): Phaser.Display.Color {
  let targetColor: Phaser.Display.Color;
  
  if (performanceScore >= 50) {
    // Between neutral and excelling
    const progress = (performanceScore - 50) / 50; // 0 to 1
    const interpolatedColor = Phaser.Display.Color.Interpolate.ColorWithColor(
      COLORS.NEUTRAL,
      COLORS.EXCEL,
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
    const progress = performanceScore / 50; // 0 to 1
    const interpolatedColor = Phaser.Display.Color.Interpolate.ColorWithColor(
      COLORS.STRUGGLE,
      COLORS.NEUTRAL,
      1,
      progress
    );
    
    targetColor = new Phaser.Display.Color(
      interpolatedColor.r, 
      interpolatedColor.g, 
      interpolatedColor.b
    );
  }
  
  return targetColor;
}

export function applyBackgroundColor(scene: Phaser.Scene, color: Phaser.Display.Color): void {
  const hexColor = Phaser.Display.Color.GetColor(
    color.red, 
    color.green, 
    color.blue
  );
  scene.cameras.main.setBackgroundColor(hexColor);
}
