export function createInspirationEffect(scene: Phaser.Scene, characterType: string) {
  const particleColors = {
    sculptor: { start: 0x964B00, end: 0x7B3F00 },
    painter: { start: 0xFF4D4D, end: 0xCC0000 },
    designer: { start: 0x4DA6FF, end: 0x0066CC },
    writer: { start: 0x9966FF, end: 0x6600CC },
    coder: { start: 0x00FF00, end: 0x008000 }
  }[characterType] || { start: 0xFFFFFF, end: 0xCCCCCC };

  return scene.add.particles(0, 0, 'particle', {
    lifespan: 1000,
    speed: { min: 50, max: 100 },
    scale: { start: 0.5, end: 0 },
    blendMode: 'ADD',
    tint: { start: particleColors.start, end: particleColors.end },
    emitting: false
  });
} 