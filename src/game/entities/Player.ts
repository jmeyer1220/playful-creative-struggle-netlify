
import Phaser from 'phaser';

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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Setup physics body
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setSize(16, 16);
    
    // Create hitbox for attacks (hidden by default)
    this.attackHitbox = scene.add.rectangle(x, y, 30, 20, 0xff0000, 0);
    scene.physics.add.existing(this.attackHitbox, false);
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    attackKeyDown: boolean,
    dashKeyDown: boolean
  ) {
    const time = this.scene.time.now;
    
    // Reset velocity if not dashing
    if (!this.isDashingFlag) {
      this.setVelocityX(0);
    }
    
    // Handle movement
    if (cursors.left.isDown) {
      this.facingRight = false;
      this.setVelocityX(-160);
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.facingRight = true;
      this.setVelocityX(160);
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
    
    // Turn off attack hitbox after 200ms
    if (this.isAttackingFlag && time > this.attackCooldown - 200) {
      this.isAttackingFlag = false;
      (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = false;
    }
    
    // Handle dashing
    if (dashKeyDown && time > this.dashCooldown && this.energy >= 20) {
      this.dash();
      this.energy = Math.max(0, this.energy - 20); // Dash costs 20 energy
      this.dashCooldown = time + 800; // Dash cooldown of 800ms
    }
    
    // Turn off dash after 200ms
    if (this.isDashingFlag && time > this.dashCooldown - 600) {
      this.isDashingFlag = false;
    }
    
    // Regenerate energy
    if (time % 10 === 0 && this.energy < 100) {
      this.energy = Math.min(100, this.energy + 0.1);
    }
    
    // Update attack hitbox position
    const hitboxOffsetX = this.facingRight ? 20 : -20;
    this.attackHitbox.setPosition(this.x + hitboxOffsetX, this.y);
  }

  private jump() {
    this.setVelocityY(-330);
    this.jumpCount++;
  }

  private attack() {
    this.isAttackingFlag = true;
    (this.attackHitbox.body as Phaser.Physics.Arcade.Body).enable = true;
    
    // Position hitbox based on facing direction
    const hitboxOffsetX = this.facingRight ? 20 : -20;
    this.attackHitbox.setPosition(this.x + hitboxOffsetX, this.y);
  }

  private dash() {
    this.isDashingFlag = true;
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
}
