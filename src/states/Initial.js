import Phaser from 'phaser'
import { State } from 'core/_state'
import { Shape } from '../sprites/Shape'

export class InitialState extends State {
  preload () {
    this.load.image('tile', 'assets/images/white_square.png')
  }
  create (game) {
    this.shapes = game.add.physicsGroup(Phaser.Physics.ARCADE)
    this.spawnShape(true)

    setInterval(this.spawnShape.bind(this), 5000)
    game.physics.startSystem(Phaser.Physics.ARCADE)
  }

  spawnShape (isCenterShape = false) {
    let shape = new Shape({
      game: this.game
    })
    shape.isCenterShape = false

    this.shapes.add(shape)
  }

  update () {
    this.game.physics.arcade.collide(this.shapes, void 0, this.handleShapeCollision.bind(this))
  }

  handleShapeCollision (shapeA, shapeB) {
    // shapeA.body.position.x -= 300
  }

  // render (game) {
  // }
}
