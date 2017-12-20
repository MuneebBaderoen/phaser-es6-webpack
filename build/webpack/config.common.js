var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var isCordova = true

// Setup paths
var webPaths = {
  output: path.resolve(__dirname, 'dist')
}

var cordovaPaths = {
  output: path.resolve(__dirname, 'www/dist')
}

var PATHS = isCordova ? cordovaPaths : webPaths

// Setup minify settings
var minifySettingsDebug = {
  removeAttributeQuotes: false,
  collapseWhitespace: false,
  html5: false,
  minifyCSS: false,
  minifyJS: false,
  minifyURLs: false,
  removeComments: false,
  removeEmptyAttributes: false
}

module.exports = function () {
  return {
    devtool: 'eval-source-map', // debug
    entry: {
      app: [
        'babel-polyfill',
        path.resolve(__dirname, 'src/main.js')
      ],
      vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
    },
    output: {
      pathinfo: true,
      path: PATHS.output,
      publicPath: '/dist',
      filename: 'bundle.js'
    },
    watch: true, // debug
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
      }),
      // Cordova only
      new CleanWebpackPlugin(['www'], {
        exclude: ['.gitkeep']
      }),
      // Cordova only
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
      // Cordova only
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, 'assets/**/*'),
        to: path.resolve(__dirname, 'www')
      }]),
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, 'www/index.html'),
        template: './src/index.html',
        chunks: [
          'vendor', 'app'
        ],
        chunksSortMode: 'manual',
        minify: minifySettingsDebug,
        isDevice: true,
        hash: true
      }),
      new HtmlWebpackPlugin({
        filename: './index.html',
        template: './src/index.html',
        chunks: ['vendor', 'app'],
        chunksSortMode: 'manual',
        minify: minifySettingsDebug,
        hash: false
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
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        'phaser': phaser,
        'pixi': pixi,
        'p2': p2
      }
    }
  }
}
