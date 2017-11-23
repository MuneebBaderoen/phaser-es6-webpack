import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import { InitialState } from './states/Initial'
import GameState from './states/Game'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement

    // Update config with screen dimensions
    config.gameWidth = docElement.clientWidth
    config.gameHeight = docElement.clientHeight

    // Initialize webgl context
    super(config.gameWidth, config.gameHeight, Phaser.WEBGL, 'content', null)

    // this.state.add('Boot', BootState, false)
    this.state.add('Game', InitialState, false)
    // this.state.add('Game', GameState, false)

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (window.cordova) {
      document.addEventListener('deviceready', () => this.initialize(), false)
    } else {
      this.initialize()
    }
  }

  initialize () {
    if (window.cordova) {

    }
    this.state.start('Game')
  }
}

window.game = new Game()
