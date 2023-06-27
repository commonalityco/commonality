const config = require('@commonalityco/config-jest');

module.exports = { ...config, setupFilesAfterEnv: ['<rootDir>/test/setup.ts'] };
