
// Simple utility to create a basic particle texture at runtime
export function createParticleTexture(scene: Phaser.Scene): void {
  // Create a simple round particle
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
  graphics.fillStyle(0xffffff);
  graphics.fillCircle(4, 4, 4);
  graphics.generateTexture('particle', 8, 8);
  graphics.destroy();
}
