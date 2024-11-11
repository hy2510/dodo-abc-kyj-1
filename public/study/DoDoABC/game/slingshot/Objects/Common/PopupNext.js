export default class PopupNext extends Phaser.GameObjects.Container {
  constructor(data) {
    let { scene } = data;

    const bg = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      1280,
      720,
      0x000000,
      0.5
    )
      .setOrigin(0)
      .setInteractive();

    const popupNext = new Phaser.GameObjects.Sprite(
      scene,
      441,
      241,
      "imgPopupNext"
    ).setOrigin(0);

    super(scene, 0, 0, [bg, popupNext]);
    this.scene = scene;
    this.bg = bg;
    this.popupNext = popupNext;

    this.popupNext.setInteractive({
      cursor: "url(../../../include/images/cursor_hover.png), pointer",
    });

    this.popupNext.once("pointerdown", () => {
      this.destroy();
      scene.startGame();
    });

    this.setSize(1280, 720).setDepth(9);
    scene.add.existing(this);
  }

  static preload(scene) {
    scene.load.image("imgPopupNext", "./images/Common/btn_next_quiz_01.png");
  }
}
