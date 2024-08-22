import * as Phaser from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from './common';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Hello World', {
        fontSize: '42px',
      })
      .setOrigin(0.5);
    this.add.image(0, 0, ASSET_KEYS.CARDS, 0).setOrigin(0);
  }
}
