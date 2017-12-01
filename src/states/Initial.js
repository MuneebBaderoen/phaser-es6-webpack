import Phaser from 'phaser'
import { State } from 'core/_state'
import { Shape } from '../sprites/Shape'

export class InitialState extends State {
  preload () {
    this.load.image('tile', 'assets/images/white_square.png')
  }
  create (game) {
    setInterval(() => {
      this.shape = new Shape({
        game
      })

      game.add.existing(this.shape)
    }, 1000)
    game.physics.startSystem(Phaser.Physics.ARCADE)
  }

  update () {
    // console.log(this.shape.getBounds())
    // this.shape.position.y += 1
    // this.shape.position.x += 1
  }

  // render (game) {
  // }
}
