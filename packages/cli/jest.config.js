const path = require('path');

const esmModules = ['find-up'];

const chalkLocationParts = require.resolve('chalk').split('chalk');
const chalkLocation = chalkLocationParts[0] + `chalk${chalkLocationParts[1]}`;

module.exports = {
  moduleNameMapper: {
    chalk: require.resolve('chalk'),
    '#ansi-styles': path.join(
      chalkLocation,
      'chalk/source/vendor/ansi-styles/index.js'
    ),
    '#supports-color': path.join(
      chalkLocation,
      'chalk/source/vendor/supports-color/index.js'
    ),
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/.pnpm/(?!(${esmModules.join('|')})@)`,
  ],
};
