/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  repositoryUrl: "git@github.com:snyk/snyk-broker-config.git",
  prepare: ['@semantic-release/npm'],
  publish: ['@semantic-release/npm', '@semantic-release/github'],
}
