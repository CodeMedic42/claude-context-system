module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'tests/lib/**/*.js',
    'tests/lib/**/*.js',
    '!tests/lib/**/*.test.js',
    '!tests/lib/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 30000, // 30 seconds for plugin execution
  setupFilesAfterEnv: [
    '<rootDir>/tests/jest-common/index.js',
  ],
};
