// eslint.config.mjs
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist', 'eslint.config.mjs'],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
)
