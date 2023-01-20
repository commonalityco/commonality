/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  verbose: false,
  transform: {
    '^.+\\.tsx?$': ['ts-jest'],
  },
};

module.exports = config;
