module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest'
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'standard-with-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error',
    'space-before-function-paren': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: {
          attributes: false
        }
      }
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unsafe-argument': 1,
    '@typescript-eslint/no-explicit-any': [
      'warn',
      {
        ignoreRestArgs: true
      }
    ],
    '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    '@typescript-eslint/unbound-method': 'off'
  },
  "env": {
    "node": true,
    "es2021": true
  }
}
