
import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { createPlatforms } from '../utils/platforms';

type MainSceneCallbacks = {
  onHealthChange: (health: number) => void;
  onEnergyChange: (energy: number) => void;
  onFeedbackChange: (state: 'neutral' | 'positive' | 'negative') => void;
};

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.Physics.Arcade.Group;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private attackKey!: Phaser.Input.Keyboard.Key;
  private dashKey!: Phaser.Input.Keyboard.Key;
  
  private callbacks: MainSceneCallbacks;
  private feedbackState: 'neutral' | 'positive' | 'negative' = 'neutral';
  private feedbackTimer: number = 0;
  private hitCounter: number = 0;
  private lastHitTime: number = 0;

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
    
    // Update HUD with initial values
    this.callbacks.onHealthChange(this.player.getHealth());
    this.callbacks.onEnergyChange(this.player.getEnergy());
  }

  update(time: number, delta: number) {
    // Update player with input
    this.player.update(
      this.cursors,
      this.attackKey.isDown,
      this.dashKey.isDown
    );
    
    // Update HUD
    this.callbacks.onHealthChange(this.player.getHealth());
    this.callbacks.onEnergyChange(this.player.getEnergy());
    
    // Update feedback state
    this.updateFeedbackState(time);
    
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
      
      // Increment hit counter and update last hit time
      this.hitCounter++;
      this.lastHitTime = this.time.now;
      
      if (this.hitCounter >= 3) {
        this.setFeedbackState('positive');
      }
      
      if (enemy.isDead()) {
        enemy.destroy();
      }
    }
  }

  private handleEnemyCollision(player: any, enemy: any) {
    if (!this.player.isInvulnerable()) {
      this.player.takeDamage(5);
      this.hitCounter = 0;
      this.setFeedbackState('negative');
    }
  }

  private setFeedbackState(state: 'neutral' | 'positive' | 'negative') {
    if (this.feedbackState !== state) {
      this.feedbackState = state;
      this.callbacks.onFeedbackChange(state);
      this.feedbackTimer = this.time.now;
    }
  }

  private updateFeedbackState(time: number) {
    // Reset feedback state after 2 seconds
    if (this.feedbackState !== 'neutral' && time - this.feedbackTimer > 2000) {
      this.setFeedbackState('neutral');
    }
    
    // Reset hit counter if no hits for 1.5 seconds
    if (this.hitCounter > 0 && time - this.lastHitTime > 1500) {
      this.hitCounter = 0;
    }
  }
}
