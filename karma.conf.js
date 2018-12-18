var jsonParser = function(config) {
  return require('body-parser').json();
};
var SeamlessTestMiddleware = function(config) {
  return require("./test/server.js")();
};
const WSSeamlessServer = require('./test/wsserver.js');

var browsers = ["PhantomJS"];
if (!process.env.C9_SH_EXECUTED) {
  browsers = ["ChromeHeadless", "FirefoxHeadless"];
}


module.exports = function(config) {
  config.set({
    //failOnEmptyTestSuite: false,
    basePath: './',
    urlRoot: '/',
    listenAddress: 'localhost',
    hostname: 'localhost',
    frameworks: ['jasmine', 'promise', 'websocket-server'],
    files: [
      { pattern: './node_modules/basic-library/src/UI/Element.js', type: 'module', include: false },
      { pattern: './src/**/*.js', type: 'module', include: false },
      // { pattern: './src/seamless.js', type: 'module', include: true },
      { pattern: './test/*.test.js', type: 'module' }
    ],
    // preprocessors: {
    //   './src/**/*.ts': ['karma-typescript']
    // },
    reporters: ['spec'],
    middleware: ['jsonParser', 'SeamlessTest'],
    websocketServer: {
      port: 8081,
      beforeStart: WSSeamlessServer,
    },
    plugins: [
      {
        'middleware:jsonParser': ['factory', jsonParser]
      },
      {
        'middleware:SeamlessTest': ['factory', SeamlessTestMiddleware]
      },
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-promise',
      'karma-websocket-server',
      'karma-spec-reporter'
    ],
    port: 8080,
    colors: true,
    autoWatch: true,
    browsers: browsers,
    browserConsoleLogOptions: {
      level: "info"
    },
    singleRun: false,
    concurrency: process.env.C9_SH_EXECUTED ? 1 : Infinity
  });
};
