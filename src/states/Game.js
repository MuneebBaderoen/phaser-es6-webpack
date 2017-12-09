/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload (game) {
    game.load.tilemap('Level1', 'assets/levels/first_level.json', null, Phaser.TILED_JSON)
    // game.load.tilemap('mario', 'assets/levels/mario.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tile_image', 'assets/tilesets/UrbanBlock(SHADOW)_centre.png')
  }

  create () {
    // this.map = this.game.add.tilemap('Level1')
    // this.map.addTilesetImage('testtileset')
    // this.map_layer = map.createLayer('World1')
    // this.map_layer.resizeWorld()

    //  The 'mario' key here is the Loader key given in game.load.tilemap
    this.map = this.game.add.tilemap('Level1')
    this.map.addTilesetImage('urban_block', 'tile_image')
    // this.map.setCollision(0)
    // layer.debug = true;

    this.layer = this.map.createLayer('layer')
    // this.layer = this.game.add.tilemapLayer(0, 0, 800, 600, 'tile_image', this.map, 0)

    // this.layer.resizeWorld()

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
    this.mushroom.body.bounce.set(0.8)
    this.mushroom.body.gravity.set(0, 180)
    this.mushroom.body.velocity = new Phaser.Point(-90, 0)

    // Setup collision group for platforms
    this.platforms = this.game.add.group()
    this.platforms.enableBody = true
    this.platforms.physicsBodyType = Phaser.Physics.ARCADE
    this.platforms.create(0, 300, 'loaderBar')
    this.platforms.setAll('body.immovable', true)

    this.unbindKeys = () => {}
    this.bindKeys(Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.D)

    this.game.camera.follow(this.mushroom)

    return this
  }

  bindKeys (jumpKey, leftKey, rightKey) {
    this.unbindKeys()

    let key1 = this.game.input.keyboard.addKey(jumpKey)
    key1.onDown.add(this.jump, this)

    let key2 = this.game.input.keyboard.addKey(leftKey)
    key2.onDown.add(this.moveLeft, this)

    let key3 = this.game.input.keyboard.addKey(rightKey)
    key3.onDown.add(this.moveRight, this)

    this.unbindKeys = () => {
      this.game.input.keyboard.removeKey(jumpKey)
      this.game.input.keyboard.removeKey(leftKey)
      this.game.input.keyboard.removeKey(rightKey)
    }
  }

  moveLeft () {
    console.log('moving left')
  }

  moveRight () {
    console.log('moving right')
  }

  jump () {
    console.log('jump')
    this.mushroom.body.gravity.set(0, this.mushroom.body.gravity.y * -1)
    this.bindKeys(Phaser.Keyboard.S, Phaser.Keyboard.D, Phaser.Keyboard.A)
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
