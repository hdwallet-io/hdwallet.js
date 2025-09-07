// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ["ts-jest", { tsconfig: "tsconfig.test.json" }],
    '^.+\\.jsx?$': ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(?:@stablelib|@noble|cbor2|@cto\\.af)/)'
  ],
  moduleFileExtensions: [
    'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
