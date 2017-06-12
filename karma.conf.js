//var webpackConf = require("./webpack.config.js");
var browsers = ["PhantomJS"];
if (!process.env.C9_SH_EXECUTED){
  browsers = browsers.concat(["Chrome", "Firefox"]);
}

module.exports = function(config) {
  config.set({
    failOnEmptyTestSuite: false,
    basePath: './',
    urlRoot: '',
    listenAddress: 'localhost',
    frameworks: ['jasmine'],
    customContextFile: 'tests/index.html',
    files: [
      {
        pattern: 'tests/index.html',
        served: true
      },
      {
        pattern: 'tests/test.js',
        included: true,
        served: true
      },
      {
        pattern: 'bin/*',
        included: true,
        served: true
      },
      {
        pattern: 'node_modules/promise-polyfill/promise.min.js',
        included: true,
        served: true
      }
    ],
    exclude: [
      'bin/*mongoose-plugin.js'
    ],
    preprocessors: {
    },
    // webpack: webpackConf,
    // webpackMiddleware: {
    //   stats: 'minimal',
    //   watchOptions: { // watching with Webpack is better than with Karma
    //     aggregateTimeout: 300
    //   }
    // },
    reporters: ['progress'],
    port: 8080,
    colors: true,
    logLevel: config.LOG_DEBUG,
    client: {
      clearContext: false
    },
    autoWatch: true,
    browsers: browsers,
    singleRun: false,
    concurrency: process.env.C9_SH_EXECUTED?1:Infinity
  })
}