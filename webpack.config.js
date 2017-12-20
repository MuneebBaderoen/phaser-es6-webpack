// Core modules
var path = require('path')
var webpack = require('webpack')

// Webpack plugins
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var WebpackNotifierPlugin = require('webpack-notifier')

// Build flags
var projectRoot = __dirname
var isRelease = process.env.npm_lifecycle_event.indexOf('release') > -1
var isCordova = process.env.npm_lifecycle_event.indexOf('cordova') > -1

// Phaser module paths
var phaserModule = path.join(projectRoot, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

// Setup paths
var webPaths = {
  clean: [path.resolve(projectRoot, 'dist')],
  output: path.resolve(projectRoot, 'dist'),
  html: path.resolve(projectRoot, 'dist/index.html'),
  htmlSource: path.resolve(projectRoot, './src/index.html'),
  copyPaths: []
}

var cordovaPaths = {
  clean: [path.resolve(projectRoot, 'www')],
  output: path.resolve(projectRoot, 'www/dist'),
  html: path.resolve(projectRoot, 'www/index.html'),
  htmlSource: path.resolve(projectRoot, './src/index.html'),
  copyPaths: [{
    from: path.resolve(projectRoot, 'assets/**/*'),
    to: path.resolve(projectRoot, 'www')
  }]
}

var PATHS = isCordova ? cordovaPaths : webPaths

// Export dynamic config
module.exports = function () {
  return {
    devtool: isRelease ? void 0 : 'eval-source-map',
    watch: !isRelease,
    entry: {
      app: [
        'babel-polyfill',
        path.resolve(projectRoot, 'src/main.js')
      ],
      vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
    },
    output: {
      pathinfo: true,
      path: PATHS.output,
      publicPath: '/dist',
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEBUG__: !isRelease,
        __DEVICE__: isCordova
      }),
      new CleanWebpackPlugin(PATHS.clean, {
        root: projectRoot,
        exclude: ['.gitkeep']
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          drop_console: isRelease
        },
        output: {
          comments: !isRelease
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.bundle.js'
      }),
      new CopyWebpackPlugin(PATHS.copyPaths),
      new HtmlWebpackPlugin({
        filename: PATHS.html,
        template: PATHS.htmlSource,
        chunks: [ 'vendor', 'app' ],
        chunksSortMode: 'manual',
        isDevice: isCordova,
        hash: true
      }),
      new WebpackNotifierPlugin({
        title: 'Cubris Webpack',
        excludeWarnings: true
      })
    ],
    module: {
      rules: [
        { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
        { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
        { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
        { test: /p2\.js/, use: ['expose-loader?p2'] }
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    resolve: {
      modules: [
        path.resolve(projectRoot, 'src'),
        path.resolve(projectRoot, 'node_modules')
      ],
      alias: {
        'phaser': phaser,
        'pixi': pixi,
        'p2': p2
      }
    }
  }
}
