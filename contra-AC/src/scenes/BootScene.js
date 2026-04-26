import {
  ANIM_FRAMERATE_IDLE,
  ANIM_FRAMERATE_WALK,
  ANIM_FRAMERATE_ATTACK,
  ANIM_FRAMERATE_ENEMY_IDLE,
  ANIM_FRAMERATE_ENEMY_WALK,
  ANIM_FRAMERATE_ENEMY_ATTACK,
  ANIM_FRAMERATE_ENEMY_HURT,
  ANIM_FRAMERATE_ENEMY_DEATH,
} from '../config.js';

const SOLDIER = 'resources/Characters(100x100)/Soldier/Soldier';
const ORC = 'resources/Characters(100x100)/Orc/Orc';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Soldier-Idle.png: 600x100 → 6 frames at 100x100.
    this.load.spritesheet('soldier-idle', `${SOLDIER}/Soldier-Idle.png`, { frameWidth: 100, frameHeight: 100 });
    // Soldier-Walk.png: 800x100 → 8 frames at 100x100.
    this.load.spritesheet('soldier-walk', `${SOLDIER}/Soldier-Walk.png`, { frameWidth: 100, frameHeight: 100 });
    // Soldier-Attack01.png: 600x100 → 6 frames at 100x100.
    this.load.spritesheet('soldier-attack', `${SOLDIER}/Soldier-Attack01.png`, { frameWidth: 100, frameHeight: 100 });

    // Orc sheets — same frame layouts as Soldier.
    this.load.spritesheet('orc-idle', `${ORC}/Orc-Idle.png`, { frameWidth: 100, frameHeight: 100 }); // 6 frames
    this.load.spritesheet('orc-walk', `${ORC}/Orc-Walk.png`, { frameWidth: 100, frameHeight: 100 }); // 8 frames
    this.load.spritesheet('orc-attack', `${ORC}/Orc-Attack01.png`, { frameWidth: 100, frameHeight: 100 }); // 6 frames
    this.load.spritesheet('orc-hurt', `${ORC}/Orc-Hurt.png`, { frameWidth: 100, frameHeight: 100 }); // 4 frames
    this.load.spritesheet('orc-death', `${ORC}/Orc-Death.png`, { frameWidth: 100, frameHeight: 100 }); // 4 frames

    // grass tileset.png: 384x128. Loaded as a single image; the ground tiles the whole bitmap horizontally.
    this.load.image('grass-tileset', 'resources/grass tileset.png');
    // Arrow01(32x32).png: single 32x32 frame; horizontal arrow pointing right.
    this.load.image('arrow', 'resources/Arrow(Projectile)/Arrow01(32x32).png');
  }

  create() {
    this.anims.create({ key: 'soldier-idle', frames: this.anims.generateFrameNumbers('soldier-idle', { start: 0, end: 5 }), frameRate: ANIM_FRAMERATE_IDLE, repeat: -1 });
    this.anims.create({ key: 'soldier-walk', frames: this.anims.generateFrameNumbers('soldier-walk', { start: 0, end: 7 }), frameRate: ANIM_FRAMERATE_WALK, repeat: -1 });
    this.anims.create({ key: 'soldier-attack', frames: this.anims.generateFrameNumbers('soldier-attack', { start: 0, end: 5 }), frameRate: ANIM_FRAMERATE_ATTACK, repeat: 0 });

    this.anims.create({ key: 'orc-idle', frames: this.anims.generateFrameNumbers('orc-idle', { start: 0, end: 5 }), frameRate: ANIM_FRAMERATE_ENEMY_IDLE, repeat: -1 });
    this.anims.create({ key: 'orc-walk', frames: this.anims.generateFrameNumbers('orc-walk', { start: 0, end: 7 }), frameRate: ANIM_FRAMERATE_ENEMY_WALK, repeat: -1 });
    this.anims.create({ key: 'orc-attack', frames: this.anims.generateFrameNumbers('orc-attack', { start: 0, end: 5 }), frameRate: ANIM_FRAMERATE_ENEMY_ATTACK, repeat: 0 });
    this.anims.create({ key: 'orc-hurt', frames: this.anims.generateFrameNumbers('orc-hurt', { start: 0, end: 3 }), frameRate: ANIM_FRAMERATE_ENEMY_HURT, repeat: 0 });
    this.anims.create({ key: 'orc-death', frames: this.anims.generateFrameNumbers('orc-death', { start: 0, end: 3 }), frameRate: ANIM_FRAMERATE_ENEMY_DEATH, repeat: 0 });

    this.scene.start('TitleScene');
  }
}
