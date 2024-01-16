/** @type {import('jest').Config} */
const config = {
  extensionsToTreatAsEsm: ['.ts'],
  injectGlobals: false,
  roots: ['./src'],
  setupFiles: ['./jest/setup.ts'],
  testMatch: ['**/__tests__/*.spec.ts'],
  transform: {
    '\\.+(ts)$': 'babel-jest',
  },
};

module.exports = config;
