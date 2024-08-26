import * as Phaser from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from './common';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.TITLE });
  }

  public create(): void {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 1).setOrigin(0);
    this.add.image(this.scale.width / 2, 100, ASSET_KEYS.TITLE, 0);
    const clickToStartImage = this.add.image(this.scale.width / 2, 250, ASSET_KEYS.CLICK_TO_START, 0);
    this.tweens.add({
      targets: clickToStartImage,
      alpha: {
        start: 1,
        from: 1,
        to: 0,
      },
      duration: 1000,
      repeat: -1,
      yoyo: true,
    });

    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0, (camera, progress: number) => {
        if (progress !== 1) {
          return;
        }
        this.scene.start(SCENE_KEYS.GAME);
      });
    });
  }
}
