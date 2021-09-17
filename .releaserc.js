const PLUGINS_FOR_SCOPED = [
  [
    '@semantic-release/exec',
    {
      prepareCmd:
        'jq \'.name |= "@3846masa/axios-cookiejar-support"\' package.json > package.json.tmp && mv package.json.tmp package.json',
      publishCmd: 'git push origin :${nextRelease.gitTag}',
    },
  ],
  '@semantic-release/commit-analyzer',
  '@semantic-release/npm',
];

const PLUGINS_FOR_NON_SCOPED = [
  '@semantic-release/commit-analyzer',
  '@semantic-release/release-notes-generator',
  '@semantic-release/changelog',
  '@semantic-release/npm',
  '@semantic-release/github',
  [
    '@semantic-release/git',
    {
      assets: ['CHANGELOG.md', 'package.json'],
    },
  ],
];

module.exports = {
  branches: ['main'],
  plugins: process.env.RELEASE_TYPE === 'scoped' ? PLUGINS_FOR_SCOPED : PLUGINS_FOR_NON_SCOPED,
  preset: 'angular',
  releaseRules: [
    { breaking: true, release: 'major' },
    { revert: true, release: 'patch' },
    { type: 'feat', release: 'minor' },
    { type: 'fix', release: 'patch' },
    { type: 'docs', release: 'patch' },
    { type: 'chore', scope: 'deps', release: 'patch' },
  ],
};
