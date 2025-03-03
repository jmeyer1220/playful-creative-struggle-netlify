
import Phaser from 'phaser';
import { Player } from './Player';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private health: number = 30;
  private chaseRange: number = 200;
  private attackRange: number = 40;
  private movementSpeed: number = 80;
  private attackCooldown: number = 0;
  private dead: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Setup physics body
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setTint(0xff0000);
  }

  update() {
    if (this.dead) return;
    
    // Implement basic enemy behavior here
    // This will be called automatically since runChildUpdate is true in the group
  }

  chasePlayer(player: Player) {
    if (this.dead) return;
    
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    
    if (distance < this.chaseRange) {
      // Move towards player
      const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
      this.setVelocityX(direction.x * this.movementSpeed);
      
      // Flip sprite based on direction
      if (direction.x < 0) {
        this.setFlipX(true);
      } else {
        this.setFlipX(false);
      }
      
      // Attack player if in range
      if (distance < this.attackRange && this.scene.time.now > this.attackCooldown) {
        this.attack(player);
      }
    } else {
      // Slow down if not chasing
      this.setVelocityX(0);
    }
  }

  attack(player: Player) {
    // Set attack cooldown
    this.attackCooldown = this.scene.time.now + 1000;
    
    // Quick lunge towards player
    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    this.setVelocityX(direction.x * this.movementSpeed * 2);
    this.setVelocityY(-100); // Small jump
    
    // Flash the enemy when attacking
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 50,
      yoyo: true,
      repeat: 1
    });
  }

  takeDamage(amount: number) {
    this.health -= amount;
    
    // Flash and knockback
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 1
    });
    
    // Apply knockback
    this.setVelocityY(-150);
    
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.dead = true;
    this.setTint(0x333333);
    this.disableBody(true, false);
    
    // Fade out and remove
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0.8,
      duration: 300,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  isDead(): boolean {
    return this.dead;
  }
}
