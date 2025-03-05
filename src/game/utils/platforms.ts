import Phaser from 'phaser';

const GRID_SIZE = 32; // Base size for our grid
const GRID_COLOR = 0x1a1a1a; // Dark gray for grid lines

export function createPlatforms(scene: Phaser.Scene): Phaser.Physics.Arcade.StaticGroup {
  const platforms = scene.physics.add.staticGroup();
  
  // Create grid background for the entire world bounds
  createGridBackground(scene);
  
  // Platform configurations using grid coordinates
  const platformConfigs = [
    // Main ground
    { x: 0, y: 17, width: 50, height: 1 }, // Extended ground platform
    
    // Main platforms (using grid coordinates)
    { x: 18, y: 12, width: 6, height: 1 },
    { x: 2, y: 8, width: 3, height: 1 },
    { x: 22, y: 7, width: 3, height: 1 },
    { x: 35, y: 9, width: 4, height: 1 }, // Additional platforms
    { x: 42, y: 11, width: 3, height: 1 },
    
    // Floating platforms
    { x: 8, y: 10, width: 2, height: 1 },
    { x: 14, y: 5, width: 3, height: 1 },
    { x: 28, y: 6, width: 2, height: 1 },
    { x: 38, y: 4, width: 2, height: 1 },
    
    // Challenge platforms
    { x: 5, y: 14, width: 1, height: 1 },
    { x: 10, y: 13, width: 1, height: 1 },
    { x: 15, y: 9, width: 1, height: 1 },
    { x: 32, y: 8, width: 1, height: 1 }
  ];
  
  // Create platforms based on grid
  platformConfigs.forEach(config => {
    const platform = platforms.create(
      config.x * GRID_SIZE,
      config.y * GRID_SIZE,
      'platform'
    )
    .setScale(config.width, config.height)
    .refreshBody();
    
    // Add cyberpunk-style glow effect
    platform.setTint(0x4466aa);
    scene.add.rectangle(
      config.x * GRID_SIZE,
      config.y * GRID_SIZE,
      config.width * GRID_SIZE,
      GRID_SIZE,
      0x4466aa,
      0.2
    ).setOrigin(0);
  });
  
  return platforms;
}

function createGridBackground(scene: Phaser.Scene) {
  // Create a graphics object for the grid
  const graphics = scene.add.graphics();
  
  // Set line style for grid
  graphics.lineStyle(1, GRID_COLOR, 0.3);
  
  // Draw vertical lines for entire world bounds
  for (let x = 0; x < scene.physics.world.bounds.width; x += GRID_SIZE) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, scene.physics.world.bounds.height);
  }
  
  // Draw horizontal lines for entire world bounds
  for (let y = 0; y < scene.physics.world.bounds.height; y += GRID_SIZE) {
    graphics.moveTo(0, y);
    graphics.lineTo(scene.physics.world.bounds.width, y);
  }
  
  // Stroke the grid
  graphics.strokePath();
}
