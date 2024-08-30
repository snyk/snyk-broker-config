import {IntegrationCredentials, dummyCredentials} from './integrations-types.js'

export const BrokerConnectionTypeArray = [
  'acr',
  'apprisk',
  'artifactory',
  'artifactory-cr',
  'azure-repos',
  'bitbucket-server',
  'digitalocean-cr',
  'docker-hub',
  'ecr',
  'gcr',
  'github',
  'github-cr',
  'github-enterprise',
  'github-server-app',
  'gitlab',
  'gitlab-cr',
  'google-artifact-cr',
  'harbor-cr',
  'jira',
  'nexus',
  'nexus-cr',
  'quay-cr',
]

export const getDummyCredentialsForIntegrationType = (type: string): IntegrationCredentials => {
  if (!BrokerConnectionTypeArray.includes(type)) {
    throw new Error(`Cannot find dummy credentials for integration type ${type}`)
  }
  return dummyCredentials[type]
}
