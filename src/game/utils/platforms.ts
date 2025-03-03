
import Phaser from 'phaser';

export function createPlatforms(scene: Phaser.Scene): Phaser.Physics.Arcade.StaticGroup {
  // Create static group for platforms
  const platforms = scene.physics.add.staticGroup();
  
  // Create main ground platform
  platforms.create(400, 570, 'ground')
    .setScale(800, 30)
    .refreshBody();
  
  // Create platforms
  platforms.create(600, 400, 'ground')
    .setScale(200, 20)
    .refreshBody();
    
  platforms.create(50, 250, 'ground')
    .setScale(100, 20)
    .refreshBody();
    
  platforms.create(750, 220, 'ground')
    .setScale(100, 20)
    .refreshBody();
  
  // Create small platforms for jumping between
  platforms.create(250, 320, 'ground')
    .setScale(60, 20)
    .refreshBody();
    
  platforms.create(450, 170, 'ground')
    .setScale(80, 20)
    .refreshBody();
  
  // Visual enhancement - platforms have a subtle glow
  platforms.getChildren().forEach((platform) => {
    (platform as Phaser.GameObjects.Sprite).setTint(0x4466aa);
  });
  
  return platforms;
}
