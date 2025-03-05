import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { createPlatforms } from '../utils/platforms';
import { AdaptiveFeedbackManager, FeedbackLevel } from '../utils/adaptiveFeedback';
import { createParticleTexture } from '../utils/assetLoader';
import { LevelGenerator } from '../utils/levelGenerator';
import { LevelConfig } from '../types/level';
import { CREATIVE_JOURNEY_LEVELS } from '../constants/creativeJourneyLevels';
import { BackgroundManager } from '../utils/backgroundManager';
import { LevelTransition } from '../utils/levelTransition';
import { CHARACTER_EFFECTS } from '../constants/characterEffects';

type MainSceneCallbacks = {
  onHealthChange: (health: number) => void;
  onInspirationChange: (inspiration: number) => void;
  onFeedbackChange: (state: 'neutral' | 'positive' | 'negative') => void;
  onLevelChange: (level: { name: string; description: string; number: number }) => void;
  characterId?: string;
};

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private attackKey!: Phaser.Input.Keyboard.Key;
  private dashKey!: Phaser.Input.Keyboard.Key;
  
  private callbacks: MainSceneCallbacks;
  private feedbackManager!: AdaptiveFeedbackManager;
  private lastFeedbackUpdate: number = 0;
  private characterId: string;
  private levelGenerator!: LevelGenerator;
  private backgroundManager!: BackgroundManager;
  private levelTransition!: LevelTransition;
  private currentLevel: string = 'Blank Canvas';
  private levelConfig!: LevelConfig;

  constructor(config: { characterId: string }) {
    super({ key: 'MainScene' });
    this.callbacks = config;
    this.characterId = config.characterId;
  }

  preload() {
    // Load images
    this.load.image('background', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80');
    this.load.image('ground', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==');
    this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQ0lEQVQ4T2NkwAH+//8/AiSNzGdkRJbDJYYsj9UAdDOI1oRXA7LNJNoLtDOAKC+QbABJmkhyAcl+ICUQSTKAXCeC9AMANSLq0Qy9c64AAAAASUVORK5CYII=');
    this.load.image('enemy', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVQ4T2NkoBAwUqifYdQABkrCYOA8APMXNn/jCl6cLsAVbUR7gaJoHE2JAxsGFCUkADsvEZHKUoZhAAAAAElFTkSuQmCC');
    
    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasdKeys = {
      up: this.input.keyboard.addKey('W'),
      down: this.input.keyboard.addKey('S'),
      left: this.input.keyboard.addKey('A'),
      right: this.input.keyboard.addKey('D'),
    };
    this.attackKey = this.input.keyboard.addKey('Z');
    this.dashKey = this.input.keyboard.addKey('X');
  }

  create() {
    // Initialize managers
    this.levelGenerator = new LevelGenerator(this, this.characterId);
    this.backgroundManager = new BackgroundManager(this, this.currentLevel, this.characterId);
    this.levelTransition = new LevelTransition(this);
    
    // Generate level and store config
    this.levelConfig = this.levelGenerator.generateLevel(this.currentLevel);
    
    // Create background first
    this.backgroundManager.createBackground();
    
    // Set world bounds based on level size
    const totalWidth = this.levelConfig.rooms.reduce((sum, room) => sum + room.width, 0);
    this.physics.world.setBounds(0, 0, totalWidth, 600);
    
    // Create platforms with themed visuals
    this.platforms = this.createThemedPlatforms(this.levelConfig);
    
    // Create player with character-specific effects
    this.player = new Player(this, 100, 300, this.characterId);
    this.player.initializeEffects(CHARACTER_EFFECTS[this.characterId]);
    
    // Camera setup with smooth follow
    this.cameras.main.setBounds(0, 0, totalWidth, 600);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setBackgroundColor(this.levelConfig.theme.backgroundColor);
    
    // Setup controls
    this.setupControls();
    
    // Setup collisions
    this.physics.add.collider(this.player, this.platforms);
    
    // Initialize feedback system
    this.feedbackManager = new AdaptiveFeedbackManager(this);
    this.feedbackManager.setParticleTarget(this.player);
    
    // Debug visualization
    this.debugDrawLevel(this.levelConfig);
    
    // Update HUD with initial values and level info
    this.callbacks.onHealthChange(this.player.getHealth());
    this.callbacks.onInspirationChange(this.player.getInspiration());
    this.callbacks.onLevelChange({
      name: this.currentLevel,
      description: CREATIVE_JOURNEY_LEVELS[this.currentLevel].description,
      number: this.getLevelNumber(this.currentLevel)
    });
  }

  private createThemedPlatforms(levelConfig: LevelConfig) {
    const platforms = this.physics.add.staticGroup();
    const theme = CREATIVE_JOURNEY_LEVELS[this.currentLevel];
    
    levelConfig.rooms.forEach(room => {
      room.platforms.forEach(platform => {
        const plt = platforms.create(
          platform.x + room.x,
          platform.y,
          'platform'
        );
        
        // Apply themed visuals
        const style = CHARACTER_EFFECTS[this.characterId].platformStyle;
        this.applyPlatformStyle(plt, style, theme);
        
        plt.setScale(platform.width / 32, platform.height / 32);
        plt.refreshBody();
      });
    });
    
    return platforms;
  }

  private applyPlatformStyle(
    platform: Phaser.Physics.Arcade.Sprite, 
    style: any, 
    theme: any
  ) {
    const graphics = this.add.graphics();
    
    if (style.border) {
      graphics.lineStyle(2, theme.platformColor, style.opacity);
      graphics.strokeRect(0, 0, platform.width, platform.height);
    }
    
    if (style.gridLines) {
      // Add grid pattern
      const gridSize = 8;
      graphics.lineStyle(1, theme.gridColor, 0.3);
      for (let x = gridSize; x < platform.width; x += gridSize) {
        graphics.lineBetween(x, 0, x, platform.height);
      }
      for (let y = gridSize; y < platform.height; y += gridSize) {
        graphics.lineBetween(0, y, platform.width, y);
      }
    }
    
    // Create texture from graphics
    const texture = graphics.generateTexture(
      `platform-${this.characterId}-${this.currentLevel}`,
      platform.width,
      platform.height
    );
    platform.setTexture(texture);
    graphics.destroy();
  }

  private debugDrawLevel(levelConfig: LevelConfig) {
    const debugGraphics = this.add.graphics();
    debugGraphics.lineStyle(2, 0x00ff00, 1);
    
    // Draw room boundaries
    levelConfig.rooms.forEach(room => {
      debugGraphics.strokeRect(room.x, room.y, room.width, room.height);
    });
    
    // Draw grid for reference
    debugGraphics.lineStyle(1, 0x333333, 0.5);
    for (let x = 0; x < this.physics.world.bounds.width; x += 32) {
      debugGraphics.lineBetween(x, 0, x, 600);
    }
    for (let y = 0; y < 600; y += 32) {
      debugGraphics.lineBetween(0, y, this.physics.world.bounds.width, y);
    }
  }

  private setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasdKeys = {
      up: this.input.keyboard.addKey('W'),
      down: this.input.keyboard.addKey('S'),
      left: this.input.keyboard.addKey('A'),
      right: this.input.keyboard.addKey('D'),
    };
    this.attackKey = this.input.keyboard.addKey('Z');
    this.dashKey = this.input.keyboard.addKey('X');
  }

  update() {
    if (!this.player) return;

    // Combine WASD and arrow key inputs
    const left = this.cursors.left.isDown || this.wasdKeys.left.isDown;
    const right = this.cursors.right.isDown || this.wasdKeys.right.isDown;
    const up = this.cursors.up.isDown || this.wasdKeys.up.isDown;
    
    // Update player with combined inputs
    this.player.update(
      { left: { isDown: left }, right: { isDown: right }, up: { isDown: up } } as any,
      this.attackKey.isDown,
      this.dashKey.isDown
    );
  }

  private createEnemy(x: number, y: number) {
    const enemy = new Enemy(this, x, y);
    this.enemies.add(enemy);
  }

  private handlePlayerAttack(hitbox: any, enemy: any) {
    if (this.player.isAttacking()) {
      enemy.takeDamage(10);
      
      // Register successful hit in feedback system
      this.feedbackManager.registerHit();
      
      if (enemy.isDead()) {
        enemy.destroy();
      }
    }
  }

  private handleEnemyCollision(player: any, enemy: any) {
    if (!this.player.isInvulnerable()) {
      const damageAmount = 5;
      this.player.takeDamage(damageAmount);
      
      // Register damage taken in feedback system
      this.feedbackManager.registerDamageTaken(damageAmount);
    }
  }

  private updateHUDFeedback() {
    const feedbackLevel = this.feedbackManager.getFeedbackLevel();
    
    // Map our feedback levels to the HUD's expected values
    let hudFeedbackState: 'neutral' | 'positive' | 'negative';
    
    switch (feedbackLevel) {
      case 'excelling':
        hudFeedbackState = 'positive';
        break;
      case 'struggling':
        hudFeedbackState = 'negative';
        break;
      default:
        hudFeedbackState = 'neutral';
    }
    
    this.callbacks.onFeedbackChange(hudFeedbackState);
  }

  private createAmbientEffects() {
    // Add subtle glow particles
    const particles = this.add.particles('particle');
    
    particles.createEmitter({
      x: 0,
      y: 0,
      quantity: 1,
      frequency: 2000,
      lifespan: 4000,
      speedY: { min: -20, max: -50 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.3, end: 0 },
      blendMode: 'ADD',
      tint: 0x4466aa,
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, 0, 800, 600)
      }
    });
  }

  private getLevelNumber(levelName: string): number {
    const levelOrder = [
      'Blank Canvas',
      'Creative Block',
      'Flow State',
      'Refinement',
      'Release'
    ];
    return levelOrder.indexOf(levelName) + 1;
  }

  async transitionToNextLevel(nextLevel: string) {
    await this.levelTransition.transitionTo(nextLevel);
    this.currentLevel = nextLevel;
    this.scene.restart();
  }
}
