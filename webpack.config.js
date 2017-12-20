var merge = require('webpack-merge')
var yargs = require('yargs')

var common = require('./build/webpack/config.common')
var debug = require('./build/webpack/config.debug')
var release = require('./build/webpack/config.release')

module.exports = function () {
  switch (mode) {
    case 'debug':
      return merge(
        common,
        debug
      )
    case 'release':
      return merge(
        common,
        release
      )
  }
}
