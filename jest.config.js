module.exports = {
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  collectCoverageFrom: [
    'packages/**/src/**',
    '!**/packages/**/dist/**',
    '!**/packages/**/src/index.ts',
    // "!packages/**/node_modules",
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
};
