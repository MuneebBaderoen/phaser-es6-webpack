import Phaser from 'phaser'
import * as _ from 'lodash'

import { Tile } from 'sprites/Tile'

import Config from 'config'

const tileSize = 64
const blockSize = 3

export class Shape extends Phaser.Sprite {
  constructor ({
    game,
    position = new Phaser.Point(),
    tilemap = [0, 0, 1, 0, 1, 1, 0, 1, 0]
  }) {
    super(game)

    this.position = position

    // Treat shapes as physics objects
    // this.enableBody = true
    game.physics.arcade.enable(this)

    let centerPosition

    _.each(tilemap, (item, index, list) => {
      if (item === 1) {
        // Check for center tile and calculate position
        const isCenter = (index === Math.floor(list.length / 2))

        const tilePosition = new Phaser.Point(
          ((index % blockSize) - Math.floor(blockSize / 2)) * tileSize,
          (Math.floor(index / blockSize) - Math.floor(blockSize / 2)) * tileSize
        )

        // Keep the center position for use as pivot
        if (isCenter) {
          centerPosition = tilePosition
        }

        // Add the new tile as a child of a shape sprite
        this.addChild(new Tile({
          game,
          position: tilePosition,
          asset: 'tile'
        }))
      }
    })

    // Bounds are not automagically recalculated.
    // Need to recalculate bounds
    this.recalculateBounds()

    // Enable collision with 'walls'
    this.body.collideWorldBounds = true

    // Set rotation pivot
    this.pivot.x = centerPosition.x
    this.pivot.y = centerPosition.y

    return this
  }

  static enableBoundingBoxes = true

  getBounds () {
    return new Phaser.Rectangle(
      this.position.x + this.bounds.x,
      this.position.y + this.bounds.y,
      this.bounds.width,
      this.bounds.height
    )
  }

  recalculateBounds () {
    this.updateTransform()
    const initialBounds = super.getBounds()
    var minX = initialBounds.x
    var minY = initialBounds.y
    var maxX = initialBounds.width
    var maxY = initialBounds.height

    for (var c = 0; c < this.children.length; c++) {
      console.log(this.children[c])
      var child = this.children[c]
      var childRect = child.getBounds()
      console.log(child.x, child.y, childRect)

      if (childRect.x < minX) minX = childRect.x
      if (childRect.y < minY) minY = childRect.y

      if (childRect.x + childRect.width > maxX) maxX = childRect.x + childRect.width
      if (childRect.y + childRect.height > maxY) maxY = childRect.y + childRect.height
    }

    // Update current bounds relative to position
    this.bounds = new Phaser.Rectangle(
      minX - this.position.x,
      minY - this.position.y,
      maxX - minX,
      maxY - minY
    )
    this.body.setSize(this.bounds.width, this.bounds.height, minX - this.position.x, minY - this.position.y)
  }

  update () {
    // this.angle += 10
    this.position.y += 3
  }
}
