module.exports = {
  roots: ['<rootDir>/specs', '<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/node_modules/**',
    '!**/folder-with-untested-files/**',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/specs/(.*)': '<rootDir>/specs/$1',
    '@/(.*)': '<rootDir>/src/$1',
  },
}
