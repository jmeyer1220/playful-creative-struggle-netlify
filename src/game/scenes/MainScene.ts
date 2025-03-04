
import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { createPlatforms } from '../utils/platforms';
import { AdaptiveFeedbackManager, FeedbackLevel } from '../utils/adaptiveFeedback';
import { createParticleTexture } from '../utils/assetLoader';

type MainSceneCallbacks = {
  onHealthChange: (health: number) => void;
  onEnergyChange: (energy: number) => void;
  onFeedbackChange: (state: 'neutral' | 'positive' | 'negative') => void;
  characterId?: string; // Added this to fix the error
};

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private attackKey!: Phaser.Input.Keyboard.Key;
  private dashKey!: Phaser.Input.Keyboard.Key;
  
  private callbacks: MainSceneCallbacks;
  private feedbackManager!: AdaptiveFeedbackManager;
  private lastFeedbackUpdate: number = 0;

  constructor(callbacks: MainSceneCallbacks) {
    super({ key: 'MainScene' });
    this.callbacks = callbacks;
  }

  preload() {
    // Load images
    this.load.image('background', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80');
    this.load.image('ground', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==');
    this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQ0lEQVQ4T2NkwAH+//8/AiSNzGdkRJbDJYYsj9UAdDOI1oRXA7LNJNoLtDOAKC+QbABJmkhyAcl+ICUQSTKAXCeC9AMANSLq0Qy9c64AAAAASUVORK5CYII=');
    this.load.image('enemy', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVQ4T2NkoBAwUqifYdQABkrCYOA8APMXNn/jCl6cLsAVbUR7gaJoHE2JAxsGFCUkADsvEZHKUoZhAAAAAElFTkSuQmCC');
    
    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  }

  create() {
    // Create particle texture
    createParticleTexture(this);
    
    // Add background
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
      .setTint(0x555555);
    
    // Create platforms
    this.platforms = createPlatforms(this);
    
    // Create player
    this.player = new Player(this, 100, 300);
    
    // Create enemies
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    });
    
    // Add enemies at different positions
    this.createEnemy(400, 300);
    this.createEnemy(600, 300);
    this.createEnemy(650, 100);
    
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

    // Set camera to follow player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(100, 100);
    
    // Initialize adaptive feedback system
    this.feedbackManager = new AdaptiveFeedbackManager(this);
    this.feedbackManager.setParticleTarget(this.player);
    
    // Update HUD with initial values
    this.callbacks.onHealthChange(this.player.getHealth());
    this.callbacks.onEnergyChange(this.player.getEnergy());
    this.updateHUDFeedback();
  }

  update(time: number, delta: number) {
    // Update adaptive feedback system
    this.feedbackManager.update(delta);
    
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
    this.callbacks.onEnergyChange(this.player.getEnergy());
    
    // Update feedback state in HUD (not too frequently)
    if (time - this.lastFeedbackUpdate > 500) {
      this.updateHUDFeedback();
      this.lastFeedbackUpdate = time;
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
}
