
const webpack = require('webpack');

module.exports = {
  entry: './src/seamless.js',
  output: {
    path: './bin',
    filename: 'seamless.bundle.js'
  },
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