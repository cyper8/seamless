var webpackConf = require("./webpack.config.js");
var browsers = ["PhantomJS"];
if (!process.env.C9_SH_EXECUTED){
  browsers = browsers.concat(["Chrome", "Firefox"]);
}

module.exports = function(config) {
  config.set({

    basePath: './',
    
    //urlRoot: '/assets/',


    frameworks: ['jasmine'],


    files: [
      'node_modules/promise-polyfill/promise.min.js',
      'bin/seamless.min.js',
      'tests/test.js'
    ],


    exclude: [
    ],


    preprocessors: {

    },

    webpack: webpackConf,

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


    autoWatch: true,


    browsers: browsers,


    singleRun: false,

    concurrency: process.env.C9_SH_EXECUTED?1:Infinity
  })
}