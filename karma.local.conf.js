module.exports = function(config) {
  config.set({
    files: [
      './bin/seamless.bundle.js',
      './tests/test.js',
    ],
    frameworks: ['mocha', 'chai'],
    browsers: ['Chrome'],
    preprocessors: {
      './tests/test.js': ['webpack']
    },
    webpack: require("./webpack.config.js"),
    plugins:[require('karma-webpack')]
  });
};
