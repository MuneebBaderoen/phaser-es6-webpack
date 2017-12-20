var merge = require('webpack-merge')

var common = require('./build/webpack/config.common')
var debug = require('./build/webpack/config.debug')
var release = require('./build/webpack/config.release')

var options = {
  projectRoot: __dirname,
  isRelease: false,
  isCordova: true
}

console.log('isCordova:', options.isCordova)
console.log('isRelease:', options.isRelease)

console.log('npm event:', process.env.npm_lifecycle_event)

module.exports = function () {
  switch ('debug') {
    case 'debug':
      return merge(
        common(options),
        debug(options)
      )
    case 'release':
      return merge(
        common(options),
        release(options)
      )
  }
}
