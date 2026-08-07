/* eslint-disable spaced-comment */

/** @type {import("jest").Config} **/
module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testEnvironment: '<rootDir>/jsdom-extended.js',
  testEnvironmentOptions: {
    customExportConditions: [
      '',
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|nanoid)/)',
  ],
  setupFilesAfterEnv: [
    './jest.setup.js',
  ],
};
