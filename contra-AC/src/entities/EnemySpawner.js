import {
  ENEMY_MAX_ON_SCREEN,
  ENEMY_SPAWN_INTERVAL_MS,
  ENEMY_SPAWN_MARGIN,
  ENEMY_VARIANTS,
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_HEIGHT,
  LEVEL_WIDTH_SCREENS,
} from '../config.js';
import { Enemy } from './Enemy.js';

const VARIANT_KEYS = Object.keys(ENEMY_VARIANTS);

export class EnemySpawner {
  constructor(scene, enemyGroup) {
    this.scene = scene;
    this.enemies = enemyGroup;
    this.levelWidth = GAME_WIDTH * LEVEL_WIDTH_SCREENS;

    this.timer = scene.time.addEvent({
      delay: ENEMY_SPAWN_INTERVAL_MS,
      loop: true,
      callback: () => this.tick(),
    });
  }

  tick() {
    if (this.enemies.countActive(true) >= ENEMY_MAX_ON_SCREEN) return;

    const variantKey = VARIANT_KEYS[Math.floor(Math.random() * VARIANT_KEYS.length)];
    const cam = this.scene.cameras.main;

    let side = Math.random() < 0.5 ? 'left' : 'right';
    let x = side === 'left'
      ? cam.worldView.x - ENEMY_SPAWN_MARGIN
      : cam.worldView.x + cam.worldView.width + ENEMY_SPAWN_MARGIN;

    if (x < 0 || x > this.levelWidth) {
      side = side === 'left' ? 'right' : 'left';
      x = side === 'left'
        ? cam.worldView.x - ENEMY_SPAWN_MARGIN
        : cam.worldView.x + cam.worldView.width + ENEMY_SPAWN_MARGIN;
      if (x < 0 || x > this.levelWidth) return; // both sides out of bounds — skip
    }

    x = Phaser.Math.Clamp(x, 0, this.levelWidth);
    const y = GAME_HEIGHT - GROUND_HEIGHT - 80;

    const enemy = new Enemy(this.scene, x, y, variantKey);
    this.enemies.add(enemy);
  }

  destroy() {
    if (this.timer) this.timer.remove(false);
  }
}
