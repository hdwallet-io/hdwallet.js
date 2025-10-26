// SPDX-License-Identifier: MIT

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.tests.json' }],
    '^.+\\.jsx?$': ['ts-jest', { tsconfig: 'tsconfig.tests.json' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(?:@stablelib|@noble|cbor2|@cto\\.af)/)'
  ],
  moduleFileExtensions: [
    'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageReporters: [
    'text', 'lcov', 'html'
  ]
};
