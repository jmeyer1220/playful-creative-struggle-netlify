import Phaser from 'phaser';
import { CharacterType } from '@/data/characters';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private health: number = 100;
  private energy: number = 100;
  private attackHitbox: Phaser.GameObjects.Rectangle;
  private isAttackingFlag: boolean = false;
  private isDashingFlag: boolean = false;
  private dashCooldown: number = 0;
  private attackCooldown: number = 0;
  private jumpCount: number = 0;
  private maxJumps: number = 2;
  private facingRight: boolean = true;
  private invulnerableUntil: number = 0;
  private baseMovementSpeed: number = 160;
  private baseDashCooldownTime: number = 800;
  private characterType: string;
  private specialAttackEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number, characterType: string) {
    super(scene, x, y, 'player');
    this.characterType = characterType;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Setup physics body
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setSize(16, 16);
    (this.body as Phaser.Physics.Arcade.Body).setGravityY(300);
    
    // Add glow effect
    const glow = scene.add.sprite(x, y, 'player-glow');
    glow.setAlpha(0.5);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    glow.setDepth(-1);
    glow.setScale(1.2);
    
    // Make glow follow player
    this.on('destroy', () => glow.destroy());
    scene.events.on('update', () => {
      glow.setPosition(this.x, this.y);
      glow.setAlpha(0.3 + Math.sin(scene.time.now / 500) * 0.2);
    });
    
    // Create hitbox for attacks (hidden by default)
    this.attackHitbox = scene.add.rectangle(x, y, 30, 20, 0xff0000, 0);
    scene.physics.add.existing(this.attackHitbox, false);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
    
    // Initialize character-specific effects
    this.initializeCharacterEffects();
  }

  private initializeCharacterEffects() {
    switch (this.characterType) {
      case 'painter':
        this.createPaintEffects();
        break;
      case 'designer':
        this.createDesignEffects();
        break;
      case 'writer':
        this.createInkEffects();
        break;
      case 'sculptor':
        this.createSculptEffects();
        break;
      case 'coder':
        this.createCodeEffects();
        break;
    }
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    attackKeyDown: boolean,
    dashKeyDown: boolean,
    speedMultiplier: number = 1.0,
    dashCooldownMultiplier: number = 1.0
  ) {
    const time = this.scene.time.now;
    
    // Reset velocity if not dashing
    if (!this.isDashingFlag) {
      this.setVelocityX(0);
    }
    
    // Handle movement with performance-based speed adjustment
    const currentSpeed = this.baseMovementSpeed * speedMultiplier;
    
    if (cursors.left.isDown) {
      this.facingRight = false;
      this.setVelocityX(-currentSpeed);
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.facingRight = true;
      this.setVelocityX(currentSpeed);
      this.setFlipX(false);
    }
    
    // Handle jumping
    if (cursors.up.isDown && this.jumpCount < this.maxJumps && cursors.up.getDuration() < 300) {
      this.jump();
    }
    
    // Reset jump count when on ground
    if (this.body.touching.down || this.body.blocked.down) {
      this.jumpCount = 0;
    }
    
    // Handle attacking
    if (attackKeyDown && time > this.attackCooldown) {
      this.attack();
      this.attackCooldown = time + 400; // Attack cooldown of 400ms
    }
    
    // Update particle emitter position
    if (this.specialAttackEmitter) {
      this.specialAttackEmitter.setPosition(this.x, this.y);
    }
    
    // Update attack hitbox position
    const hitboxOffsetX = this.facingRight ? 20 : -20;
    this.attackHitbox.setPosition(this.x + hitboxOffsetX, this.y);
  }

  private jump() {
    this.setVelocityY(-400);
    this.jumpCount++;
  }

  private attack() {
    if (this.attackCooldown > 0) return;
    
    const direction = this.facingRight ? 1 : -1;
    
    // Position attack hitbox
    this.attackHitbox.setPosition(this.x + (35 * direction), this.y);
    this.attackHitbox.setSize(50, 40);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
    
    // Emit particles based on character type
    if (this.specialAttackEmitter) {
      // Emit in the direction the player is facing
      this.specialAttackEmitter.setPosition(this.x + (20 * direction), this.y);
      this.specialAttackEmitter.explode(10);
    }
    
    this.attackCooldown = 400;
    this.isAttackingFlag = true;
    
    // Reset attack state after delay
    this.scene.time.delayedCall(200, () => {
      this.isAttackingFlag = false;
      (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
    });
  }

  private dash() {
    this.isDashingFlag = true;
    // Apply performance-based dash speed (same calculation as movement for consistency)
    const dashSpeed = this.facingRight ? 400 : -400;
    this.setVelocityX(dashSpeed);
    
    // Make temporarily invulnerable while dashing
    this.invulnerableUntil = this.scene.time.now + 300;
  }

  takeDamage(amount: number) {
    if (this.isInvulnerable()) return;
    
    this.health = Math.max(0, this.health - amount);
    this.invulnerableUntil = this.scene.time.now + 1000; // Invulnerable for 1 second after taking damage
    
    // Flash the player to indicate damage
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 4
    });
    
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.disableBody(true, false);
    
    // Flash and scale down
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0.5,
      duration: 500,
      onComplete: () => {
        // Restart the scene after a short delay
        this.scene.time.delayedCall(1000, () => {
          this.scene.scene.restart();
        });
      }
    });
  }

  getAttackHitbox(): Phaser.GameObjects.Rectangle {
    return this.attackHitbox;
  }

  isAttacking(): boolean {
    return this.isAttackingFlag;
  }

  isInvulnerable(): boolean {
    return this.scene.time.now < this.invulnerableUntil;
  }

  getHealth(): number {
    return this.health;
  }

  getEnergy(): number {
    return this.energy;
  }

  // Character-specific attack implementations
  private paintAttack() {
    // Wide-arc paint splash attack
    const direction = this.facingRight ? 1 : -1;
    this.specialAttackEmitter?.setPosition(this.x, this.y);
    this.specialAttackEmitter?.explode(20);
    
    // Create wide hitbox
    this.attackHitbox.setPosition(this.x + (30 * direction), this.y);
    this.attackHitbox.setSize(60, 40);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
  }

  private designAttack() {
    // Precise geometric shapes attack
    const direction = this.facingRight ? 1 : -1;
    
    // Create triangle-shaped attack pattern
    for (let i = 0; i < 3; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        const angle = (i * 45 - 45) * direction;
        this.specialAttackEmitter?.setPosition(this.x, this.y);
        this.specialAttackEmitter?.explode(5);
      });
    }
    
    this.attackHitbox.setPosition(this.x + (40 * direction), this.y);
    this.attackHitbox.setSize(50, 50);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
  }

  private inkAttack() {
    // Quick successive ink blots
    const direction = this.facingRight ? 1 : -1;
    
    for (let i = 0; i < 4; i++) {
      this.scene.time.delayedCall(i * 50, () => {
        this.specialAttackEmitter?.setPosition(this.x + (20 * direction), this.y);
        this.specialAttackEmitter?.explode(3);
      });
    }
    
    this.attackHitbox.setPosition(this.x + (30 * direction), this.y);
    this.attackHitbox.setSize(40, 30);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
  }

  private sculptAttack() {
    // Heavy, powerful stone attack
    const direction = this.facingRight ? 1 : -1;
    
    this.specialAttackEmitter?.setPosition(this.x + (20 * direction), this.y);
    this.specialAttackEmitter?.explode(10);
    
    // Larger, more powerful hitbox
    this.attackHitbox.setPosition(this.x + (25 * direction), this.y);
    this.attackHitbox.setSize(45, 45);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
  }

  private codeAttack() {
    // Matrix-style code fragments attack
    const direction = this.facingRight ? 1 : -1;
    
    for (let i = 0; i < 8; i++) {
      this.scene.time.delayedCall(i * 30, () => {
        this.specialAttackEmitter?.setPosition(
          this.x + (Math.random() * 40 - 20) * direction,
          this.y + Math.random() * 40 - 20
        );
        this.specialAttackEmitter?.explode(2);
      });
    }
    
    this.attackHitbox.setPosition(this.x + (35 * direction), this.y);
    this.attackHitbox.setSize(50, 40);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
  }

  // Effect creation methods
  private createPaintEffects() {
    this.specialAttackEmitter = this.scene.add.particles(this.x, this.y, 'particle', {
      follow: this,
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      tint: 0xff4f4f,
      lifespan: 1000,
      gravityY: 100,
      quantity: 2,
      frequency: 100
    });
  }

  private createDesignEffects() {
    this.specialAttackEmitter = this.scene.add.particles(this.x, this.y, 'particle', {
      follow: this,
      speed: { min: 150, max: 250 },
      scale: { start: 0.3, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      tint: 0x4fc3f7,
      lifespan: 800,
      angle: { min: -30, max: 30 },
      quantity: 3,
      frequency: 80
    });
  }

  private createInkEffects() {
    this.specialAttackEmitter = this.scene.add.particles(this.x, this.y, 'particle', {
      follow: this,
      speed: { min: 120, max: 180 },
      scale: { start: 0.4, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      tint: 0x2c2c2c,
      lifespan: 1200,
      gravityY: 200,
      quantity: 4,
      frequency: 60
    });
  }

  private createSculptEffects() {
    this.specialAttackEmitter = this.scene.add.particles(this.x, this.y, 'particle', {
      follow: this,
      speed: { min: 80, max: 150 },
      scale: { start: 0.6, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      tint: 0x964B00,
      lifespan: 1500,
      gravityY: 300,
      quantity: 1,
      frequency: 120
    });
  }

  private createCodeEffects() {
    this.specialAttackEmitter = this.scene.add.particles(this.x, this.y, 'particle', {
      follow: this,
      speed: { min: 200, max: 300 },
      scale: { start: 0.3, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      tint: 0x00ff00,
      lifespan: 600,
      quantity: 5,
      frequency: 50,
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(-20, -20, 40, 40)
      }
    });
  }
}
