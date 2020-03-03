module.exports = {
  root: true,
  env: {
    browser: false,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/ban-types': ['warn'],
    '@typescript-eslint/camelcase': [0],
    '@typescript-eslint/consistent-type-assertions': ['warn'],
    '@typescript-eslint/consistent-type-definitions': ['warn'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/explicit-member-accessibility': [0],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/interface-name-prefix': [0],
    '@typescript-eslint/no-empty-interface': ['warn'],
    '@typescript-eslint/no-inferrable-types': ['warn'],
    '@typescript-eslint/no-namespace': ['warn'],
    '@typescript-eslint/no-non-null-assertion': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': [0],
    '@typescript-eslint/no-var-requires': ['warn'],
    'array-callback-return': ['warn'],
    'arrow-body-style': [0],
    'arrow-parens': [0],
    'class-methods-use-this': ['warn'],
    'comma-dangle': ['warn'],
    'consistent-return': ['warn'],
    'default-case': ['warn'],
    'dot-notation': ['warn'],
    'function-paren-newline': [0],
    'implicit-arrow-linebreak': [0],
    'key-spacing': ['warn'],
    'lines-between-class-members': [0],
    'max-len': ['warn', { code: 150 }],
    'new-cap': ['warn'],
    'no-mixed-operators': ['warn'],
    'no-multi-spaces': ['warn'],
    'no-param-reassign': ['warn'],
    'no-plusplus': ['warn'],
    'no-prototype-builtins': ['warn'],
    'no-return-assign': ['warn'],
    'no-return-await': ['warn'],
    'no-self-assign': ['warn'],
    'no-shadow': ['warn'],
    'no-throw-literal': ['warn'],
    'no-underscore-dangle': ['error', { 'allow': ['_links'] }],
    'no-underscore-dangle': [0],
    'no-unused-expressions': ['error', { 'allowShortCircuit': true } ],
    'no-use-before-define': [0],
    'no-useless-constructor': ['warn'],
    'no-useless-escape': ['warn'],
    'object-curly-newline': [0],
    'operator-linebreak': ['warn'],
    'operator-linebreak': [0],
    'padded-blocks': [0],
    'prefer-destructuring': ['warn'],
    'prefer-object-spread': ['warn'],
    'prefer-promise-reject-errors': [0],
    'prefer-spread': ['warn']
  },
}