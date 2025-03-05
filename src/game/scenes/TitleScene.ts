export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const titleArt = `
  ______   _______   _______      __ ___________ __ ___      ___ _______       ________ ___________ _______  ____  ____  _______   _______  ___      _______  
 /" _  "\\ /"      \\ /"     "|    /""|"     _   "|" |"  \\    /"  /"     "|     /"       |"     _   "/"      \\|"  _||_ " |/" _   "| /" _   "||"  |    /"     "| 
(: ( \\___|:        (: ______)   /    )__/  \\\\__/||  \\   \\  //  (: ______)    (:   \\___/ )__/  \\\\__|:        |   (  ) : (: ( \\___)(: ( \\___)||  |   (: ______) 
 \\/ \\    |_____/   )\\/    |    /' /\\  \\ \\\\_ /   |:  |\\\\  \\/.  ./ \\/    |       \\___  \\      \\\\_ /  |_____/   (:  |  | . )\\/ \\      \\/ \\     |:  |    \\/    |   
 //  \\ _  //      / // ___)_  //  __'  \\|.  |   |.  | \\.    //  // ___)_       __/  \\\\     |.  |   //      / \\\\ \\__/ // //  \\ ___ //  \\ ___ \\  |___ // ___)_  
(:   _) \\|:  __   \\(:      "|/   /  \\\\  \\:  |   /\\  |\\ \\\\   /  (:      "|     /" \\   :)    \\:  |  |:  __   \\ /\\\\ __ //\\(:   _(  _(:   _(  _( \\_|:  (:      "| 
 \\_______|__|  \\___)\\_______(___)    \\___\\__|  (__\\_|_) \\__/    \\_______)    (_______/      \\__|  |__|  \\___(__________)\\________)\\_______ )\\_______)\\_______) 
    `;

    // Create background
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a0a, 1);
    bg.fillRect(0, 0, 800, 600);

    // Add grid effect
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x1a1a1a, 0.3);
    for (let x = 0; x < 800; x += 32) {
      grid.lineBetween(x, 0, x, 600);
    }
    for (let y = 0; y < 600; y += 32) {
      grid.lineBetween(0, y, 800, y);
    }

    // Add ASCII art text
    const title = this.add.text(400, 200, titleArt, {
      fontFamily: 'Fira Code',
      fontSize: '8px',
      color: '#4DA6FF',
      align: 'center',
      lineSpacing: 0
    }).setOrigin(0.5);

    // Add start prompt
    const startText = this.add.text(400, 450, 'PRESS SPACE TO START', {
      fontFamily: 'Fira Code',
      fontSize: '24px',
      color: '#4DA6FF'
    }).setOrigin(0.5);

    // Blink effect for start text
    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Handle input
    this.input.keyboard.once('keydown-SPACE', () => {
      this.cameras.main.fade(1000, 0, 0, 0);
      this.time.delayedCall(1000, () => {
        this.scene.start('MainScene');
      });
    });

    // Add ambient particles
    this.createAmbientParticles();
  }

  private createAmbientParticles() {
    const particles = this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: 800 },
      y: { min: 0, max: 600 },
      quantity: 1,
      frequency: 500,
      lifespan: 4000,
      gravityY: -10,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.5, end: 0 },
      tint: 0x4DA6FF,
      blendMode: Phaser.BlendModes.ADD
    });
  }
} 