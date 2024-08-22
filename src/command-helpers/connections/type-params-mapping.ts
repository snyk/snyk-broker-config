import {Flags} from '@oclif/core'
import {FlagProps, FlagRelationship, Relationship} from './types.js'

const craConfigType1Types = new Set([
  'acr',
  'artifactory-cr',
  'docker-hub',
  'gcr',
  'github-cr',
  'gitlab-cr',
  'google-artifact-cr',
  'harbor-cr',
  'nexus-cr',
  'quay-cr',
])
const scmTypes = new Set([
  'azure-repos',
  'bitbucket-server',
  'github',
  'github-enterprise',
  'github-server-app',
  'gitlab',
])

export const connectionTypes = [
  ...craConfigType1Types.values(),
  ...scmTypes.values(),
  'apprisk',
  'artifactory',
  'jira',
  'nexus',
  'digitalocean-cr',
  'ecr',
]
export interface TypeMapping {
  [key: string]: {
    [key: string]: {
      description: string
      sensitive?: boolean
      input?: string
    }
  }
}

export const flagConnectionMapping: TypeMapping = {
  apprisk: {
    broker_client_url: {description: 'Broker Client Url'},
    checkmarx: {description: 'Checkmarx hostname'},
    checkmarx_password: {description: 'Checkmarx Password Credentials Reference', sensitive: true},
    checkmarx_username: {description: 'Checkmarx Username'},
  },
  artifactory: {
    artifactory_url: {
      description: 'Artifactory URL (Credentials Reference as it may contain sensitive values)',
      sensitive: true,
    },
  },
  jira: {
    jira: {description: 'Jira Hostname'},
    jira_username: {description: 'Jira Username'},
    jira_password: {description: 'Jira Password Credentials Reference', sensitive: true},
    jira_pat: {description: 'JIRA Pat Reference', sensitive: true},
  },
  nexus: {
    base_nexus_url: {
      description: 'Nexus URL (Credentials Reference as it may contain sensitive values)',
      sensitive: true,
    },
  },
  'azure-repos': {
    broker_client_url: {description: 'Broker Client Url'},
    azure_repos_token: {description: 'Azure Repos Token Credentials Reference', sensitive: true},
    azure_repos_org: {description: 'Azure Repos Org Name'},
  },
  'bitbucket-server': {
    broker_client_url: {description: 'Broker Client Url'},
    bitbucket: {description: 'Bitbucket Hostname'},
    bitbucket_username: {description: 'Bitbucket Username'},
    bitbucket_password: {description: 'Bitbucket Password Credentials Reference', sensitive: true},
    bitbucket_pat: {description: 'Bitbucket Pat Credentials Reference', sensitive: true},
  },
  github: {
    broker_client_url: {description: 'Broker Client Url'},
    github_token: {description: 'Github Token Credentials Reference', sensitive: true},
  },
  'github-enterprise': {
    broker_client_url: {description: 'Broker Client Url'},
    github: {description: 'GHE Hostname'},
    github_token: {description: 'Github Token Credentials Reference', sensitive: true},
  },
  'github-server-app': {
    broker_client_url: {description: 'Broker Client Url'},
    github: {description: 'Github Url'},
    github_api: {description: 'Github Api Url'},
    github_app_client_id: {description: 'Github App Client Id Credentials Refs', sensitive: true},
    github_app_id: {description: 'Github App Id'},
    github_app_installation_id: {description: 'Github App Installation Id'},
    github_app_private_pem_path: {description: 'Github Private Pem cert path'},
  },
  gitlab: {
    broker_client_url: {description: 'Broker Client Url'},
    gitlab: {description: 'Gitlab Hostname'},
    gitlab_token: {description: 'Gitlab Token Credentials Reference', sensitive: true},
  },
  acr: {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'artifactory-cr': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'docker-hub': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'digitalocean-cr': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_token: {description: 'CR Token Credentials Reference', sensitive: true},
  },
  ecr: {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_role_arn: {description: 'CR Role Arn'},
    cr_region: {description: 'CR Region'},
    cr_external_id: {description: 'CR External Id'},
  },
  gcr: {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'github-cr': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'gitlab-cr': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'google-artifact-cr': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'harbor-cr': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'nexus-cr': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'quay-cr': {
    broker_client_url: {description: 'Broker Client Url'},
    cr_agent_url: {description: 'CR Agent Url'},
    cr_base: {description: 'CR Base Url'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
}

export const allRelationshipsFunc = (): Relationship[] => {
  const relationshipArray: Relationship[] = []

  for (const [key, value] of Object.entries(flagConnectionMapping)) {
    const flagRelationships: FlagRelationship[] = []

    for (const key2 of Object.keys(value)) {
      if (['bitbucket_password', 'bitbucket_username', 'jira_password', 'jira_username'].includes(key2)) {
        flagRelationships.push({name: key2, when: async (flags) => flags['type'] === key && !flags[`${key}_pat`]})
      } else if (['bitbucket_pat', 'jira_pat'].includes(key2)) {
        flagRelationships.push({
          name: key2,
          when: async (flags) => flags['type'] === key && !flags[`${key}_username`] && !flags[`${key}_password`],
        })
      } else {
        flagRelationships.push({name: key2, when: async (flags) => flags['type'] === key})
      }
    }
    const relationship: Relationship = {
      type: 'all',
      flags: flagRelationships,
    }
    relationshipArray.push(relationship)
  }

  return relationshipArray
}
export const allConnectionsParametersFlagsFunc = (): Record<any, FlagProps> => {
  const flags: Record<any, FlagProps> = {}
  for (const [key, value] of Object.entries(flagConnectionMapping)) {
    for (const [key2, value2] of Object.entries(value)) {
      flags[key2] = Flags.string({
        description: value2.description,
        required: false,
      })
    }
  }
  return flags
}
