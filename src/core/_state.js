import Phaser from 'phaser'

export class State extends Phaser.State {
  init () {
    // console.log('init')
    // Called first before any other lifecycle methods
  }

  preload (game) {
    // console.log('preload')
    // Load assets necessary for this state here
  }

  // Loading game loop
  loadUpdate (game) {
    // console.log('loadUpdate')
    // Called during the loading process
    // Only happens if assets will be loaded by the preload method
  }

  loadRender (game) {
    // console.log('loadRender')
    // Called during the loading process
    // Only happens if assets will be loaded by the preload method
    // Any assets rendered here must already exist
  }

  create (game) {
    // console.log('create')
    // create is called once preload has completed, this includes 
    // the loading of any assets from the Loader. 
    // If you don't have a preload method then create is the first 
    // method called in your State.
  }

  // Game loop once everything has loaded
  update (game) {
    // console.log('update')
  }

  preRender (game, elapsedTime) {
    // console.log('preRender')
    // Called after updates, but before rendering
  }

  render (game) {
    // console.log('base render')
  }

  shutdown (game) {
    // console.log('shutdown')
    // Called when leaving this state
  }

  // Callbacks for global gamestate changes
  resize (width, height) {
    // console.log('resize')
    // If your game is set to Scalemode RESIZE then each time the 
    // browser resizes it will call this function, passing in the 
    // new width and height.
  }

  paused (game) {
    // console.log('paused')
    // Will be called if core gameloop is paused
  }

  pauseUpdate (game) {
    // console.log('pauseUpdate')
  }

  resumed (game) {
    // console.log('resumed')
    // will be called when the core game loop resumes from a paused state.
  }
}
