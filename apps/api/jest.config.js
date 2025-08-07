module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  moduleNameMapper: {
    '^@root/(.*)$': '<rootDir>/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@useCase/(.*)$': '<rootDir>/src/useCase/$1',
    '^@service/(.*)$': '<rootDir>/src/service/$1',
    '^@errors/(.*)$': '<rootDir>/src/errors/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
  },
};
