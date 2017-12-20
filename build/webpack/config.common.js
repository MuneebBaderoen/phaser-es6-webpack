var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (options) {
  // Get options that will be used
  var projectRoot = options.projectRoot
  // var isDebug = !options.isRelease
  var isRelease = options.isRelease
  var isCordova = options.isCordova

  // Phaser webpack config
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

  return {
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
        __DEVICE__: isCordova
      }),
      new CleanWebpackPlugin(PATHS.clean, {
        root: projectRoot,
        exclude: ['.gitkeep']
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // Cordova only
      // new webpack.optimize.UglifyJsPlugin({
      //   drop_console: true,
      //   minimize: true,
      //   output: {
      //     comments: false
      //   }
      // }),
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
        minify: {
          removeAttributeQuotes: isRelease,
          collapseWhitespace: isRelease,
          html5: true,
          minifyCSS: isRelease,
          minifyJS: isRelease,
          minifyURLs: isRelease,
          removeComments: isRelease,
          removeEmptyAttributes: isRelease
        },
        isDevice: isCordova,
        hash: true
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
