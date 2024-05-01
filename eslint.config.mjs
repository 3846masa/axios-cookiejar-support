import { configs as sharedConfigs } from '@3846masa/configs/eslint/config.mjs';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...sharedConfigs,
  {
    files: ['examples/**/*'],
    rules: {
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              group: 'external',
              pattern: 'axios-cookiejar-support',
            },
          ],
        },
      ],
    },
  },
];
