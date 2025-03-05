const CREATIVE_JOURNEY_LEVELS = {
  'Blank Canvas': {
    backgroundColor: 0x0a0a0a,
    platformColor: 0x4DA6FF,
    gridColor: 0x1a1a1a,
    enemyTypes: ['self-doubt', 'perfectionist'],
    music: 'blank-canvas-theme',
    description: 'The intimidating beginning of any creative project'
  },
  'Creative Block': {
    backgroundColor: 0x1a0f1f,
    platformColor: 0x7E22CE,
    gridColor: 0x2d1f3d,
    enemyTypes: ['inner-critic', 'deadline'],
    music: 'creative-block-theme',
    description: 'Navigating through moments of stuck inspiration'
  },
  'Flow State': {
    backgroundColor: 0x0f1f1a,
    platformColor: 0x22CE7E,
    gridColor: 0x1f3d2d,
    enemyTypes: ['inspiration', 'breakthrough'],
    music: 'flow-state-theme',
    description: 'The euphoric zone of peak creativity'
  },
  'Refinement': {
    backgroundColor: 0x1f1a0f,
    platformColor: 0xCE7E22,
    gridColor: 0x3d2d1f,
    enemyTypes: ['feedback', 'revision'],
    music: 'refinement-theme',
    description: 'Polishing and iterating on the work'
  },
  'Release': {
    backgroundColor: 0x1f0f1a,
    platformColor: 0xCE227E,
    gridColor: 0x3d1f2d,
    enemyTypes: ['judgment', 'expectation'],
    music: 'release-theme',
    description: 'The challenging final step of sharing work'
  }
};

export class LevelGenerator {
  private scene: Phaser.Scene;
  private seed: number;
  private characterType: string;

  constructor(scene: Phaser.Scene, characterType: string, seed?: number) {
    this.scene = scene;
    this.characterType = characterType;
    this.seed = seed || Math.random();
  }

  generateLevel(levelName: string): LevelConfig {
    const theme = CREATIVE_JOURNEY_LEVELS[levelName];
    
    // Adjust generation based on character type
    const characterModifiers = {
      designer: {
        platformStyle: 'geometric',
        roomStructure: 'grid-based',
        specialElements: ['blueprint-zones', 'construction-points']
      },
      sculptor: {
        platformStyle: 'organic',
        roomStructure: 'cave-like',
        specialElements: ['breakable-walls', 'moldable-terrain']
      },
      painter: {
        platformStyle: 'flowing',
        roomStructure: 'open-canvas',
        specialElements: ['color-zones', 'paint-surfaces']
      },
      writer: {
        platformStyle: 'linear',
        roomStructure: 'narrative-based',
        specialElements: ['word-platforms', 'story-fragments']
      },
      coder: {
        platformStyle: 'binary',
        roomStructure: 'modular',
        specialElements: ['terminal-zones', 'debug-points']
      }
    };

    const modifiers = characterModifiers[this.characterType as keyof typeof characterModifiers];
    
    return {
      rooms: this.generateRooms(levelName, modifiers),
      theme,
      checkpoints: this.placeCheckpoints(),
      specialElements: this.placeSpecialElements(modifiers.specialElements),
      enemies: this.generateEnemies(theme.enemyTypes)
    };
  }

  private generateRooms(levelName: string, modifiers: any) {
    // Generate rooms based on level theme and character modifiers
    const rooms = [];
    const roomCount = this.getRoomCount(levelName);

    for (let i = 0; i < roomCount; i++) {
      rooms.push(this.generateRoom(i, modifiers));
    }

    return rooms;
  }

  private getRoomCount(levelName: string): number {
    // Different levels have different lengths based on their challenge
    return {
      'Blank Canvas': 2,
      'Creative Block': 4,
      'Flow State': 3,
      'Refinement': 3,
      'Release': 2
    }[levelName] || 3;
  }

  // ... rest of the implementation
} 