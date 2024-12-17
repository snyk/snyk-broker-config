/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  repositoryUrl: 'git@github.com:snyk/snyk-broker-config.git',
  prepare: [
    [
      // compile typescript files
      '@semantic-release/exec',
      {
        prepareCmd: 'npm run build',
      },
    ],
    '@semantic-release/npm',
  ],
  publish: ['@semantic-release/npm', '@semantic-release/github'],
}
