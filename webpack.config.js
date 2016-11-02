
const webpack = require('webpack');

module.exports = {
  entry: './src/seamless.js',
  output: {
    path: './bin',
    filename: 'seamless.bundle.js',
    sourceMapFilename: '[file].map'
  },
  devtool: '#source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true,
      },
      output: {
        comments: false,
      },
    }),
  ]
};