var webpack = require('webpack')

module.exports = function (options) {
  return {
    devtool: 'eval-source-map',
    watch: true,
    plugins: [
      new webpack.DefinePlugin({
        __DEBUG__: true
      })
    ]
  }
}
