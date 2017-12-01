import Phaser from 'phaser'

export class Tile extends Phaser.Sprite {
  constructor ({ game, position }) {
    const asset = 'tile'

    super(game, position.x || 0, position.y || 0, asset)

    this.anchor.setTo(0.5)
    this.scale = new Phaser.Point(64 / 256, 64 / 256)
  }

  update () {
    // this.angle += 10
  }
}
