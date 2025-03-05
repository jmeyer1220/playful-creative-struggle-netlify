import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { createPlatforms } from '../utils/platforms';
import { AdaptiveFeedbackManager, FeedbackLevel } from '../utils/adaptiveFeedback';
import { createParticleTexture } from '../utils/assetLoader';
import { LevelGenerator } from '../utils/levelGenerator';
import { LevelConfig } from '../types/level';

type MainSceneCallbacks = {
  onHealthChange: (health: number) => void;
  onInspirationChange: (inspiration: number) => void;
  onFeedbackChange: (state: 'neutral' | 'positive' | 'negative') => void;
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
  private currentLevel: string = 'Grid Protocol';

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
    // Initialize level generator
    this.levelGenerator = new LevelGenerator(this);
    
    // Generate level
    const levelConfig = this.levelGenerator.generateLevel(this.currentLevel);
    
    // Set world bounds based on level size
    const totalWidth = levelConfig.rooms.reduce((sum, room) => sum + room.width, 0);
    this.physics.world.setBounds(0, 0, totalWidth, 600);
    
    // Enable camera follow
    this.cameras.main.setBounds(0, 0, totalWidth, 600);
    this.cameras.main.startFollow(this.player);
    
    // Create platforms from level config
    this.platforms = this.createPlatformsFromConfig(levelConfig);
    
    // Create player
    this.player = new Player(this, 100, 300, this.characterId);
    
    // Create enemies at strategic positions
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    });
    
    // Position enemies on platforms
    this.createEnemy(600, 300); // On middle platform
    this.createEnemy(700, 150); // On high platform
    this.createEnemy(250, 450); // On ground level
    
    // Setup both arrow keys and WASD
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasdKeys = {
      up: this.input.keyboard.addKey('W'),
      down: this.input.keyboard.addKey('S'),
      left: this.input.keyboard.addKey('A'),
      right: this.input.keyboard.addKey('D'),
    };
    
    // Setup action keys
    this.attackKey = this.input.keyboard.addKey('Z');
    this.dashKey = this.input.keyboard.addKey('X');
    
    // Setup collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    
    // Setup overlap for combat
    this.physics.add.overlap(
      this.player.getAttackHitbox(),
      this.enemies,
      this.handlePlayerAttack,
      undefined,
      this
    );
    
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handleEnemyCollision,
      undefined,
      this
    );
    
    // Initialize adaptive feedback system
    this.feedbackManager = new AdaptiveFeedbackManager(this);
    this.feedbackManager.setParticleTarget(this.player);
    
    // Update HUD with initial values
    this.callbacks.onHealthChange(this.player.getHealth());
    this.callbacks.onInspirationChange(this.player.getEnergy());
    this.updateHUDFeedback();
    
    // Debug physics
    this.physics.world.createDebugGraphic();
    
    console.log('Scene created, player position:', this.player.x, this.player.y);
  }

  private createPlatformsFromConfig(levelConfig: LevelConfig) {
    const platforms = this.physics.add.staticGroup();
    
    levelConfig.rooms.forEach(room => {
      room.platforms.forEach(platform => {
        platforms.create(
          platform.x + room.x,
          platform.y,
          'platform'
        )
        .setScale(platform.width / 32, platform.height / 32)
        .refreshBody();
      });
    });
    
    return platforms;
  }

  update() {
    if (!this.player) return;

    // Combine WASD and arrow key inputs
    const left = this.cursors.left.isDown || this.wasdKeys.left.isDown;
    const right = this.cursors.right.isDown || this.wasdKeys.right.isDown;
    const up = this.cursors.up.isDown || this.wasdKeys.up.isDown;

    // Update player movement
    if (left) {
      this.player.setVelocityX(-160);
    } else if (right) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    // Handle jumping
    if (up && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    console.log('Player position:', this.player.x, this.player.y);

    // Update player with input state
    this.player.update(
      this.cursors,
      this.attackKey.isDown,
      this.dashKey.isDown
    );
    
    // Update adaptive feedback system
    this.feedbackManager.update(this.time.delta);
    
    // Get player buffs based on performance
    const { speedMultiplier, dashCooldownMultiplier } = this.feedbackManager.getPlayerBuffs();
    
    // Update player with input and buffs
    this.player.update(
      this.cursors,
      this.attackKey.isDown,
      this.dashKey.isDown,
      speedMultiplier,
      dashCooldownMultiplier
    );
    
    // Update HUD
    this.callbacks.onHealthChange(this.player.getHealth());
    this.callbacks.onInspirationChange(this.player.getEnergy());
    
    // Update feedback state in HUD (not too frequently)
    if (this.time.now - this.lastFeedbackUpdate > 500) {
      this.updateHUDFeedback();
      this.lastFeedbackUpdate = this.time.now;
    }
    
    // Enemies chase player if within range
    this.enemies.getChildren().forEach((enemy) => {
      (enemy as Enemy).chasePlayer(this.player);
    });
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
}
