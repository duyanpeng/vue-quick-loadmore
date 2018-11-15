var webpackConfig = require('./config/webpack.test.config.js')

module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],

    files: [
      'test/**/*.spec.js'
    ],

    preprocessors: {
      '**/*.spec.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    reporters: ['spec','coverage'],

    browsers: ['ChromeHeadless'],
    coverageReporter: {
        dir: './coverage',
        reporters: [
          { type: 'lcov', subdir: '.' },
          { type: 'text-summary' }
        ]
      }
  })
}