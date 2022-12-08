const path = require('path');

const scriptPath = path.join(__dirname, '..', 'scripts');

module.exports = {
  root: true,
  extends: [path.join(scriptPath, '.eslintrc.js')],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    'react-hooks/rules-of-hooks': 'off',
    'jest/no-done-callback': 'off',
    '@typescript-eslint/dot-notation': [
      'error',
      {
        allowIndexSignaturePropertyAccess: true,
      },
    ],
  },
  overrides: [
    {
      // this package depends on a lot of peerDependencies we don't want to specify, because npm would install them
      files: ['**/frameworks/angular/template/**/*'],
      rules: {
        '@typescript-eslint/no-useless-constructor': 'off',
        '@typescript-eslint/dot-notation': 'off',
      },
    },
    {
      // this package depends on a lot of peerDependencies we don't want to specify, because npm would install them
      files: ['**/addons/docs/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: [
        '*.js',
        '*.jsx',
        '*.json',
        '*.html',
        '**/.storybook/*.ts',
        '**/.storybook/*.tsx',
        'setup-jest.ts',
      ],
      parserOptions: {
        project: null,
      },
      rules: {
        // '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/return-await': 'off',
      },
    },
    {
      // this package depends on a lot of peerDependencies we don't want to specify, because npm would install them
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'no-shadow': 'off',
        '@typescript-eslint/ban-types': 'warn', // should become error, in the future
      },
    },
    {
      // this package uses pre-bundling, dependencies will be bundled, and will be in devDepenencies
      files: [
        '**/lib/theming/**/*',
        '**/lib/router/**/*',
        '**/ui/manager/**/*',
        '**/ui/components/**/*',
      ],
      rules: {
        'import/no-extraneous-dependencies': ['error', { bundledDependencies: false }],
      },
    },
    {
      files: ['**/ui/*', '**/ui/.storybook/*'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
      },
    },
    {
      files: [
        '**/__tests__/**',
        '**/__testfixtures__/**',
        '**/*.test.*',
        '**/*.stories.*',
        '**/storyshots/**/stories/**',
      ],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/__testfixtures__/**'],
      rules: {
        'react/forbid-prop-types': 'off',
        'react/no-unused-prop-types': 'off',
        'react/require-default-props': 'off',
      },
    },
    { files: '**/.storybook/config.js', rules: { 'global-require': 'off' } },
    {
      files: ['**/*.stories.*'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.tsx', '**/*.ts'],
      rules: {
        'react/require-default-props': 'off',
        'react/prop-types': 'off', // we should use types
        'react/forbid-prop-types': 'off', // we should use types
        'no-dupe-class-members': 'off', // this is called overloads in typescript
        'react/no-unused-prop-types': 'off', // we should use types
        'react/default-props-match-prop-types': 'off', // we should use types
        'import/no-named-as-default': 'warn',
        'import/no-named-as-default-member': 'warn',
        'react/destructuring-assignment': 'warn',

        // This warns about importing interfaces and types in a normal import, it's arguably better to import with the `type` prefix separate from the runtime imports,
        // I leave this as a warning right now because we haven't really decided yet, and the codebase is riddled with errors if I set to 'error'.
        // It IS set to 'error' for JS files.
        'import/named': 'warn',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'vars-on-top': 'off',
        'no-var': 'off', // this is how typescript works
        'spaced-comment': 'off',
      },
    },
    {
      files: ['**/mithril/**/*'],
      rules: {
        'react/no-unknown-property': 'off', // Need to deactivate otherwise eslint replaces some unknown properties with React ones
      },
    },
    {
      files: ['**/e2e-tests/**/*'],
      rules: {
        'jest/no-test-callback': 'off', // These aren't jest tests
      },
    },
    {
      files: ['**/builder-vite/input/iframe.html'],
      rules: {
        'no-undef': 'off', // ignore "window" undef errors
      },
    },
    {
      // Because those templates reference css files in other directory.
      files: ['**/template/cli/**/*'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
};
