// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    '^.+\\.(css|styl|less|sass|scss)$': 'jest-transform-stub',
    '^.+\\.(png|jpg|jpeg|gif|webp|svg)$': 'jest-transform-stub'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|react-router-dom)/)'
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  extensionsToTreatAsEsm: ['.jsx']
};