module.exports = {
    preset: '@pallad/scripts',
    runner: './serialRunner.js',
    rootDir: ".",
    roots: ['<rootDir>'],
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.json'
        }
    },
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/../src/$1',
    },
};