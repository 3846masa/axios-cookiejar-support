import { configs as sharedConfigs } from '@3846masa/configs/eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist/**', 'examples/**'],
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
