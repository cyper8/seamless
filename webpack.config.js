
const webpack = require("webpack");
const path = require('path');
const env = process.env.NODE_ENV;
const srcRoot = path.resolve(__dirname,"src");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      BROWSER:  JSON.stringify(true),
      NODE_ENV: JSON.stringify(env || 'development'),
      C9_SH_EXECUTED: JSON.stringify(process.env.C9_SH_EXECUTED || 0)
    }
  }),
  new CopyWebpackPlugin([
    {from: srcRoot+'/seamless-mongoose-plugin.js'}
  ]),
  new webpack.LoaderOptionsPlugin({
    debug: env !== 'production'
  })
];

if (env === "production"){
  var plugins = plugins.concat([new UglifyJSPlugin()]);
}

var resolve = {
  modules: ["node_modules",".",srcRoot],
  extensions: ["*",".js"]
}

module.exports = [
  {
    context: srcRoot,
    entry:["seamless.js"],
    target: 'web',
    //devtool: 'inline-source-map',
    plugins: plugins,
    output: {
      path: `${__dirname}/bin`,
      library: 'Seamless',
      libraryTarget: 'var',
      filename: env === "production" ? "seamless-client.min.js" : "seamless-client.js"
    },
    resolve
  }
]