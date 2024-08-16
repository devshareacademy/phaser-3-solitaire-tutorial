import * as Phaser from 'phaser';
import { SCENE_KEYS } from './common';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.PRELOAD });
  }

  public preload(): void {
    // load assets
  }

  public create(): void {
    this.scene.start(SCENE_KEYS.TITLE);
  }
}
