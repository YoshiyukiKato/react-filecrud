const path = require('path');
const webpack = require('webpack');

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

module.exports = {
  cache: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    //new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: true, warnings: VERBOSE } }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],

  entry : {
    "index" : ["./src/index.jsx", "./src/style.scss"],
  },

  output: {
    publicPath: '/',
    sourcePrefix: '',
    path: __dirname + '/dest',
    filename: '[name].js',
  },

  target: "web",

  resolve: {
    extensions: ['.js', '.jsx'],
  },
  
  devtool : 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, "dest"),
    compress: true,
    port: 9000
  },

  module : {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        loader : 'babel-loader',
        exclude : /node_modules/,
        include : __dirname + "/src"
      },
      {
        test : /\.scss$/,
        loaders : ["style-loader", "css-loader", "sass-loader"],
        include : __dirname + "/src"
      }
    ]
  }
};
