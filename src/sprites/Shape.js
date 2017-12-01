import Phaser from 'phaser'
import * as _ from 'lodash'

import { Tile } from 'sprites/Tile'

import Config from 'config'

const tileSize = 64
// const blockSize = 3

class ShapeTemplate {
  constructor ({
    tilemap = [1, 1, 1, 1, 1, 1, 1, 1, 1],
    gridSize = 5
  } = {}) {
    this.gridSize = gridSize
    this.values = this.fillArray(tilemap, this.gridSize * this.gridSize, 0)

    // Deal with values not equal to desired width and height
    return this
  }

  fillArray = (arr, desiredLength, padValue) => {
    while (arr.length < desiredLength) {
      arr.push(padValue)
    }
    return arr
  }
}

export class Shape extends Phaser.Sprite {
  static enableBoundingBoxes = true

  constructor ({
    game,
    position = new Phaser.Point(),
    template = new ShapeTemplate()
  } = {}) {
    super(game)

    this.position = position

    if (template.gridSize % 2 === 0) { throw new Error('Template grid size must be odd') }

    let centerPosition

    _.each(template.values, (item, index, list) => {
      // Check for center tile
      const isCenter = (index === Math.floor(list.length / 2))

      if (item === 1 || isCenter) {
        const tilePosition = new Phaser.Point(
          ((index % template.gridSize) - Math.floor(template.gridSize / 2)) * tileSize,
          (Math.floor(index / template.gridSize) - Math.floor(template.gridSize / 2)) * tileSize
        )

        // Keep the center position for use as rotation pivot
        if (isCenter) { centerPosition = tilePosition }

        // Add the new tile as a child of a shape sprite
        this.addChild(new Tile({
          game,
          position: tilePosition,
          asset: 'tile'
        }))
      }
    })

    // Treat shapes as physics objects
    // this.enableBody = true
    game.physics.arcade.enable(this)

    // Bounds are not automagically recalculated.
    // Need to recalculate bounds
    this.recalculateBounds()

    // Enable collision with 'walls'
    this.body.collideWorldBounds = true

    // Set rotation pivot
    this.pivot.x = centerPosition.x
    this.pivot.y = centerPosition.y

    this.body.velocity.y = 30
    // this.body.angularVelocity = 10
    return this
  }

  getBounds () {
    return new Phaser.Rectangle(
      this.position.x + this.bounds.x,
      this.position.y + this.bounds.y,
      this.bounds.width,
      this.bounds.height
    )
  }

  recalculateBounds () {
    // Transform into view
    this.updateTransform()

    // Find current bounds
    const initialBounds = super.getBounds()

    var minX = initialBounds.x
    var minY = initialBounds.y
    var maxX = initialBounds.width
    var maxY = initialBounds.height

    _.each(this.children, (child) => {
      var childRect = child.getBounds()

      if (childRect.x < minX) { minX = childRect.x }
      if (childRect.y < minY) { minY = childRect.y }

      if (childRect.x + childRect.width > maxX) { maxX = childRect.x + childRect.width }
      if (childRect.y + childRect.height > maxY) { maxY = childRect.y + childRect.height }
    })

    // Update current bounds relative to position
    this.bounds = new Phaser.Rectangle(
      minX - this.position.x,
      minY - this.position.y,
      maxX - minX,
      maxY - minY
    )

    // Update physics body bounds
    this.body.setSize(
      this.bounds.width,
      this.bounds.height,
      minX - this.position.x,
      minY - this.position.y
    )
  }

  update () {
    this.recalculateBounds()
    this.game.debug.geom(this.getBounds())
  }
}
