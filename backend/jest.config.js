module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/api/tests/**/*.test.js'],
  collectCoverageFrom: [
    'api/**/*.js',
    'database/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/api/tests/setup.js'],
  verbose: true,
  testTimeout: 30000
};