module.exports = {
    root: true,
    ignorePatterns: [
        ".eslintrc.js",
        "jest.config.js",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    plugins: ["@typescript-eslint"],
    env: {
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    rules: {
        'curly': 'error',
        'array-bracket-spacing': 'error',
        'brace-style': 'error',
        'no-multi-spaces': 'error',
        'comma-spacing': 'error',
        'func-call-spacing': ["error", "never"],
        'indent': ["error"],
        'keyword-spacing': ["error"],
        'semi-spacing': ["error"],
        'space-before-blocks': ["error"],
        "space-before-function-paren": ["error", "never"],
        'space-in-parens': ["error"],
        'space-infix-ops': ["error"],
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/type-annotation-spacing': 'error',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
}
