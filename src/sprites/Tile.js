import Phaser from 'phaser'

export class Tile extends Phaser.Sprite {
  constructor ({ game, position = { x: 0, y: 0 } } = {}) {
    const asset = 'tile'
    console.log(position)

    super(game, position.x, position.y, asset)

    this.anchor.setTo(0.5)
    this.scale = new Phaser.Point(64 / 256, 64 / 256)
  }

  update () {
    // this.angle += 10
  }
}
