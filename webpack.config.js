
const webpack = require("webpack");
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const srcRoot = path.resolve(__dirname, "src");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER: JSON.stringify(true),
      C9_SH_EXECUTED: JSON.stringify(process.env.C9_SH_EXECUTED || 0)
    }
  }),
  new webpack.LoaderOptionsPlugin({
    debug: env !== 'production'
  })
];

var resolve = {
  modules: ["node_modules", ".", srcRoot],
  extensions: ["*", ".js"]
};

module.exports = {
  context: srcRoot,
  entry: ["seamless.js"],
  target: 'web',
  mode: env,
  //devtool: 'inline-source-map',
  plugins: plugins,
  output: {
    path: `${__dirname}/bin`,
    library: 'Seamless',
    libraryExport: 'Seamless',
    libraryTarget: 'var',
    filename: env === "production" ? "seamless-client.min.js" : "seamless-client.js"
  },
  resolve
};
