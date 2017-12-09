/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload (game) {
    game.load.tilemap('Level1', 'assets/levels/first_level.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tile_image', 'assets/tilesets/UrbanBlock(SHADOW)_centre.png')
    game.load.image('background', 'assets/tilesets/UrbanBackground.png')
  }

  create () {
    this.background = new Phaser.Sprite(this.game, 0, 0, 'background')
    this.game.add.existing(this.background)

    // Setup tilemap
    this.map = this.game.add.tilemap('Level1')
    this.map.addTilesetImage('urban_block', 'tile_image')
    this.map.setCollision(1)
    this.layer = this.map.createLayer('Terrain')
    // this.layer.debug = true
    this.layer.resizeWorld()

    this.mushroom = new Mushroom({
      game: this.game,
      x: 100,
      y: 100,
      asset: 'mushroom'
    })

    // Setup collision and physics on the mushroom
    this.game.add.existing(this.mushroom)
    this.game.physics.arcade.enable(this.mushroom)
    this.mushroom.body.collideWorldBounds = true
    this.mushroom.body.bounce.set(0.4)
    this.mushroom.body.gravity.set(0, 180)

    this.setGravityMode(3)

    this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.gravityPlayerBindings, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.gravityPlayerBindings, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.gravityPlayerBindings, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.gravityPlayerBindings, this)

    return this
  }

  setGravityMode (direction) {
    this.unbindKeys = () => {}
    const gravityForce = 300
    const jumpVelocity = 290
    const moveVelocity = 100

    switch (direction) {
      case 0:
        // left
        this.mushroom.body.gravity.set(-gravityForce, 0)
        this.bindKeys(Phaser.Keyboard.D, Phaser.Keyboard.W, Phaser.Keyboard.S)
        this.jumpVelocity = new Phaser.Point(jumpVelocity, 0)
        this.rightVelocity = new Phaser.Point(0, -moveVelocity)
        this.leftVelocity = new Phaser.Point(0, moveVelocity)
        break
      case 1:
        // up
        this.mushroom.body.gravity.set(0, -gravityForce)
        this.bindKeys(Phaser.Keyboard.S, Phaser.Keyboard.D, Phaser.Keyboard.A)
        this.jumpVelocity = new Phaser.Point(0, jumpVelocity)
        this.rightVelocity = new Phaser.Point(moveVelocity, 0)
        this.leftVelocity = new Phaser.Point(-moveVelocity, 0)
        break
      case 2:
        // right
        this.mushroom.body.gravity.set(gravityForce, 0)
        this.bindKeys(Phaser.Keyboard.A, Phaser.Keyboard.S, Phaser.Keyboard.W)
        this.jumpVelocity = new Phaser.Point(-jumpVelocity, 0)
        this.rightVelocity = new Phaser.Point(0, -moveVelocity)
        this.leftVelocity = new Phaser.Point(moveVelocity, 0)
        break
      case 3:
        // down
        this.mushroom.body.gravity.set(0, gravityForce)
        this.bindKeys(Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.D)
        this.jumpVelocity = new Phaser.Point(0, -jumpVelocity)
        this.rightVelocity = new Phaser.Point(moveVelocity, 0)
        this.leftVelocity = new Phaser.Point(-moveVelocity, 0)
        break
    }
  }

  bindKeys (jumpKey, leftKey, rightKey) {
    this.unbindKeys()

    this.game.input.keyboard.addKey(jumpKey).onDown.add(this.jump, this)
    this.game.input.keyboard.addKey(leftKey).onDown.add(this.moveLeft, this)
    this.game.input.keyboard.addKey(rightKey).onDown.add(this.moveRight, this)

    this.unbindKeys = () => {
      this.game.input.keyboard.removeKey(jumpKey)
      this.game.input.keyboard.removeKey(leftKey)
      this.game.input.keyboard.removeKey(rightKey)
    }
  }

  gravityPlayerBindings (key) {
    console.log(key.keyCode)
    switch (key.keyCode) {
      case 37: // left
        this.setGravityMode(0)
        break
      case 38: // up
        this.setGravityMode(1)
        break
      case 39: // right
        this.setGravityMode(2)
        break
      case 40: // down
        this.setGravityMode(3)
        break
    }
  }

  moveLeft () {
    console.log('moving left')
    this.mushroom.body.velocity = this.leftVelocity
  }

  moveRight () {
    console.log('moving right')
    this.mushroom.body.velocity = this.rightVelocity
  }

  jump () {
    console.log('jump')
    this.mushroom.body.velocity = this.jumpVelocity
  }

  update (game) {
    game.physics.arcade.collide(this.mushroom, this.layer)
    game.physics.arcade.collide(this.mushroom, this.platforms)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
