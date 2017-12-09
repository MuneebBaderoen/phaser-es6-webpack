/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    })

    this.game.add.existing(this.mushroom)

    this.platforms = this.game.add.group()
    this.platforms.enableBody = true
    this.platforms.physicsBodyType = Phaser.Physics.ARCADE
    this.platforms.create(0, 300, 'loaderBar')
    this.platforms.setAll('body.immovable', true)

    // this.loader_bar = this.game.add.sprite(40, 0, 'loaderBar')
    // this.loader_bar.angle = 90
    // this.loader_bar.scale = new Phaser.Point(3, 1)

    // this.loader_bar2 = this.game.add.sprite(640, 0, 'loaderBar')
    // this.loader_bar2.angle = 90
    // this.loader_bar2.scale = new Phaser.Point(3, 1)

    // this.loader_bar3 = this.game.add.sprite(0, 20, 'loaderBar')
    // this.loader_bar3.scale = new Phaser.Point(5, 1)

    // this.loader_bar4 = this.game.add.sprite(0, 300, 'loaderBar')
    // this.loader_bar4.scale = new Phaser.Point(5, 1)

    // this.game.physics.arcade.enable([
    //   this.loader_bar,
    //   this.loader_bar2,
    //   this.loader_bar3,
    //   this.loader_bar4,
    //   this.mushroom
    // ])
    this.game.physics.arcade.enable(this.mushroom)
    this.mushroom.body.collideWorldBounds = true
    this.mushroom.body.bounce.set(0.8)
    this.mushroom.body.gravity.set(0, 180)
    this.mushroom.body.velocity = new Phaser.Point(-70, 0)
  }

  update (game) {
    this.game.physics.arcade.collide(this.mushroom, this.platforms)
    // this.game.physics.arcade.collide(this.mushroom, this.loader_bar2)
    // this.game.physics.arcade.collide(this.mushroom, this.loader_bar3)
    // this.game.physics.arcade.collide(this.mushroom, this.loader_bar4)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
