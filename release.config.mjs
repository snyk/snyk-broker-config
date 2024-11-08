/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  repositoryUrl: 'git@github.com:snyk/snyk-broker-config.git',
  prepare: [
    '@semantic-release/npm',
    [
      // generate oclif.manifest.json
      '@semantic-release/exec',
      {
        prepareCmd: "npx oclif manifest"
      },
    ],
    [
      // compile typescript files
      '@semantic-release/exec',
      {
        prepareCmd: "npm run build"
      },
    ]
  ],
  publish: ['@semantic-release/npm', '@semantic-release/github'],
}
