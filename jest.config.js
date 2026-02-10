/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                module: 'commonjs',
                moduleResolution: 'node',
                jsx: 'react-jsx',
                resolveJsonModule: true,
                esModuleInterop: true,
                strict: true,
                target: 'ES2017',
                paths: {
                    '@/*': ['./*'],
                },
            },
        }],
    },
};
