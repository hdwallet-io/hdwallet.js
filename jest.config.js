// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ["ts-jest", { tsconfig: "tsconfig.test.json" }],
    '^.+\\.jsx?$': ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },

  transformIgnorePatterns: ["/node_modules/"]
};
