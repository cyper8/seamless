
const webpack = require("webpack");
const path = require('path');
const env = process.env.NODE_ENV;
const srcRoot = path.resolve(__dirname,"src");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER:  JSON.stringify(true),
      NODE_ENV: JSON.stringify(env || 'development'),
      C9_SH_EXECUTED: JSON.stringify(process.env.C9_SH_EXECUTED || 0)
    }
  }),
  new webpack.LoaderOptionsPlugin({
    debug: env !== 'production'
  })
];

if (env === "production"){
  plugins.push(new UglifyJSPlugin());
}

module.exports = {
  context: srcRoot,
  entry:["seamless.js"],
  //devtool: 'inline-source-map',
  plugins: plugins,
  output: {
    path: `${__dirname}/bin`,
    library: 'Seamless',
    libraryTarget: 'var',
    filename: env === "production" ? "seamless.min.js" : "seamless.js"
  },
  resolve:{
    modules: ["node_modules",".",srcRoot],
    alias: {
      Basic: srcRoot
    },
    extensions: ["*",".js"]
  }
}