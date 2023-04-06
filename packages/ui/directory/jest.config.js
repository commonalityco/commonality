module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
