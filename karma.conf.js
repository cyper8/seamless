var webpackConf = require("./webpack.config.js");
var jsonParser = function(config) {
  return require('body-parser').json();
};
var SeamlessTestMiddleware = function(config) {
  return require("./tests/server.js")();
};

var browsers = ["PhantomJS"];
if (!process.env.C9_SH_EXECUTED) {
  browsers = browsers.concat(["Chrome", "Firefox"]);
}

module.exports = function(config) {
  config.set({
    //failOnEmptyTestSuite: false,
    basePath: './',
    urlRoot: '/',
    listenAddress: 'localhost',
    hostname: 'localhost',
    frameworks: ['jasmine', 'promise'],
    //customContextFile: 'tests/index.html',
    files: [
      './src/seamless.js',
      './tests/test.js'
    ],
    preprocessors: {
      './src/seamless.js': 'webpack'
    },
    webpack: webpackConf,
    webpackMiddleware: {
      stats: 'minimal',
      watchOptions: { // watching with Webpack is better than with Karma
        aggregateTimeout: 1000,
        ignored: /node_modules/
      }
    },
    middleware: ['jsonParser', 'SeamlessTest'],
    plugins: [
      {
        'middleware:jsonParser': ['factory', jsonParser]
      },
      {
        'middleware:SeamlessTest': ['factory', SeamlessTestMiddleware]
      },
      'karma-jasmine',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-promise'
    ],
    port: 8080,
    colors: true,
    logLevel: config.LOG_DEBUG,
    // client: {
    //   clearContext: false
    // },
    //autoWatch: true,
    browsers: browsers,
    singleRun: false,
    concurrency: process.env.C9_SH_EXECUTED ? 1 : Infinity
  })
}