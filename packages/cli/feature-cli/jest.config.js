const config = require('@commonalityco/config-jest');

module.exports = {
  ...config,
  moduleNameMapper: {
    '#ansi-styles':
      '<rootDir>/node_modules/chalk/source/vendor/ansi-styles/index.js',
    '#supports-color':
      '<rootDir>/node_modules/chalk/source/vendor/supports-color/index.js',
  },
};
