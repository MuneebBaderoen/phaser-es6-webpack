import Phaser from 'phaser'

export default class extends Phaser.State {
  preload () {
    this.load.image('title', './assets/images/title.png')
  }

  create (game) {
    this.title = new Phaser.Sprite(game, 0, 0, 'title')
    this.game.add.existing(this.title)
  }

  render () {
    setTimeout(() => {
      this.state.start('Game')
    }, 2000)
  }
}
