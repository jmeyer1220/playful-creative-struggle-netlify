// Simple utility to create a basic particle texture at runtime
export function createParticleTexture(scene: Phaser.Scene): void {
  // Create a simple round particle
  const graphics = scene.make.graphics({ x: 0, y: 0 });
  graphics.fillStyle(0xffffff);
  graphics.fillCircle(4, 4, 4);
  graphics.generateTexture('particle', 8, 8);
  graphics.destroy();
}

export function createPlayerSprite(scene: Phaser.Scene) {
  // Create a simple 16x16 pixel character
  const graphics = scene.make.graphics({ x: 0, y: 0 });
  
  // Main body (cyberpunk style)
  graphics.fillStyle(0x00ffff); // Cyan base
  graphics.fillRect(4, 4, 8, 12);
  
  // Glow effect
  graphics.lineStyle(1, 0x00ffff, 0.5);
  graphics.strokeRect(3, 3, 10, 14);
  
  // Generate the texture
  graphics.generateTexture('player', 16, 16);
  graphics.destroy();
}
