/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  prepare: ['@semantic-release/npm'],
  publish: ['@semantic-release/npm', '@semantic-release/github'],
}
