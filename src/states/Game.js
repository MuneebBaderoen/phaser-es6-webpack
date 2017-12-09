/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  preload (game) {
    game.load.image('mushroom', 'assets/images/mushroom2.png')
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

    this.setGravityMode(0)

    this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.setGravityMode, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.setGravityMode, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.setGravityMode, this)
    this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.setGravityMode, this)

    return this
  }

  setGravityMode (key) {
    this.unbindKeys = () => {}
    const gravityForce = 500
    const jumpVelocity = 390
    const moveVelocity = 280

    switch (key.keyCode) {
      case 37:
        // left
        this.mushroom.body.gravity.set(-gravityForce, 0)
        this.bindKeys(Phaser.Keyboard.D, Phaser.Keyboard.W, Phaser.Keyboard.S)
        this.jumpVelocity = new Phaser.Point(jumpVelocity, 0)
        this.rightVelocity = new Phaser.Point(0, moveVelocity)
        this.leftVelocity = new Phaser.Point(0, -moveVelocity)
        this.jumpAxis = 'x'
        this.moveAxis = 'y'
        break
      case 38:
        // up
        this.mushroom.body.gravity.set(0, -gravityForce)
        this.bindKeys(Phaser.Keyboard.S, Phaser.Keyboard.D, Phaser.Keyboard.A)
        this.jumpVelocity = new Phaser.Point(0, jumpVelocity)
        this.rightVelocity = new Phaser.Point(-moveVelocity, 0)
        this.leftVelocity = new Phaser.Point(moveVelocity, 0)
        this.jumpAxis = 'y'
        this.moveAxis = 'x'
        break
      case 39:
        // right
        this.mushroom.body.gravity.set(gravityForce, 0)
        this.bindKeys(Phaser.Keyboard.A, Phaser.Keyboard.S, Phaser.Keyboard.W)
        this.jumpVelocity = new Phaser.Point(-jumpVelocity, 0)
        this.rightVelocity = new Phaser.Point(0, -moveVelocity)
        this.leftVelocity = new Phaser.Point(0, moveVelocity)
        this.jumpAxis = 'x'
        this.moveAxis = 'y'
        break
      case 40:
      default:
        // down
        this.mushroom.body.gravity.set(0, gravityForce)
        this.bindKeys(Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.D)
        this.jumpVelocity = new Phaser.Point(0, -jumpVelocity)
        this.rightVelocity = new Phaser.Point(moveVelocity, 0)
        this.leftVelocity = new Phaser.Point(-moveVelocity, 0)
        this.jumpAxis = 'y'
        this.moveAxis = 'x'
        break
    }
  }

  bindKeys (jumpKey, leftKey, rightKey) {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.W)
    this.game.input.keyboard.removeKey(Phaser.Keyboard.A)
    this.game.input.keyboard.removeKey(Phaser.Keyboard.S)
    this.game.input.keyboard.removeKey(Phaser.Keyboard.D)

    this.jumpKey = this.game.input.keyboard.addKey(jumpKey)
    this.jumpKey.onDown.add(this.jump, this)
    this.leftKey = this.game.input.keyboard.addKey(leftKey)
    this.leftKey.onDown.add(this.moveLeft, this)
    this.rightKey = this.game.input.keyboard.addKey(rightKey)
    this.rightKey.onDown.add(this.moveRight, this)
  }

  moveLeft () {
    console.log('moving left')
    this.mushroom.body.velocity[this.moveAxis] = new Phaser.Point(this.leftVelocity.x, this.leftVelocity.y)[this.moveAxis]
  }

  moveRight () {
    console.log('moving right')
    this.mushroom.body.velocity[this.moveAxis] = new Phaser.Point(this.rightVelocity.x, this.rightVelocity.y)[this.moveAxis]
  }

  jump () {
    console.log('jump')
    this.mushroom.body.velocity[this.jumpAxis] = new Phaser.Point(this.jumpVelocity.x, this.jumpVelocity.y)[this.jumpAxis]
  }

  update (game) {
    game.physics.arcade.collide(this.mushroom, this.layer)
    game.physics.arcade.collide(this.mushroom, this.platforms)
    if (!this.jumpKey.isDown && !this.leftKey.isDown && !this.rightKey.isDown) {
      this.mushroom.body.velocity.x *= 0.98
      this.mushroom.body.velocity.y *= 0.98
    }
  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
