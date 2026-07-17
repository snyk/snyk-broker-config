/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  repositoryUrl: 'git@github.com:snyk/snyk-broker-config.git',
  verifyConditions: [
    '@semantic-release/github'
  ], 
  prepare: [
    [
      // compile typescript files
      '@semantic-release/exec',
      {
        prepareCmd: 'npm run build',
      },
    ],
    ['@semantic-release/npm', { npmPublish: false }],
  ],
  publish: [
    // Publish via `npm publish` so npm's OIDC trusted publishing is used
    // (@semantic-release/npm can't yet, semantic-release/npm#1121).
    ['@semantic-release/npm', { npmPublish: false }],
    ['@semantic-release/exec', { publishCmd: 'npm publish' }],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'dist/deb/*.deb',
          },
          {
            path: 'dist/macos/*.pkg',
          },
          {
            path: 'dist/win32/*.exe',
          },
        ],
      },
    ],
  ],
}
