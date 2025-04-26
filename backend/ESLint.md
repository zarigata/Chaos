# ESLint & Prettier Configuration

## .eslintrc.js
```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error'
  }
};
```

## .prettierrc
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```
