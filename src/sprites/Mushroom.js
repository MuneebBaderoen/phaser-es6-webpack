import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
  }

  update (game) {
    // if (this.game.time.prevTime) {
    //   this.angle += 1 / (2 * 3.14159)
    // }
  }
}
