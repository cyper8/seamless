
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
  var pluginsWeb = plugins.concat([new UglifyJSPlugin()]);
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
    plugins: pluginsWeb,
    output: {
      path: `${__dirname}/bin`,
      library: 'Seamless',
      libraryTarget: 'var',
      filename: env === "production" ? "seamless-client.min.js" : "seamless-client.js"
    },
    resolve
  },{
    context:srcRoot,
    entry:'seamless-mongoose-plugin.js',
    target: 'node',
    plugins,
    output:{
      path: `${__dirname}/bin`,
      filename: 'seamless-mongoose-plugin.js'
    },
    resolve
  }
]