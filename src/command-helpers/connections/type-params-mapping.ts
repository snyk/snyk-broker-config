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
  'github-cloud-app',
  'gitlab',
])
export const nonSourceIntegrations = new Set(['apprisk', 'artifactory', 'jira', 'nexus'])

export const connectionTypes = [
  ...craConfigType1Types.values(),
  ...scmTypes.values(),
  ...nonSourceIntegrations.values(),
  'digitalocean-cr',
  'ecr',
]
export interface TypeMapping {
  [key: string]: {
    [key: string]: {
      description: string
      sensitive?: boolean
      input?: string
      dataType?: 'hostname' | 'url'
      skippable?: boolean
      prohibitedValues: string[]
    }
  }
}

export const flagConnectionMapping: TypeMapping = {
  apprisk: {
    checkmarx: {
      description: 'Checkmarx Hostname (leave empty if not using Checkmarx)',
      dataType: 'hostname',
      skippable: true,
      prohibitedValues: [],
    },
    checkmarx_password: {
      description: 'Checkmarx Password Credentials Reference (leave empty if not using Checkmarx)',
      sensitive: true,
      skippable: true,
      prohibitedValues: [],
    },
    checkmarx_username: {
      description: 'Checkmarx Username (leave empty if not using Checkmarx)',
      skippable: true,
      prohibitedValues: [],
    },
    sonar_qube_host_url: {
      description: 'Sonarqube Hostname (leave empty if not using Sonarqube)',
      dataType: 'hostname',
      skippable: true,
      prohibitedValues: [],
    },
    sonar_qube_api_token: {
      description: 'Sonarqube Api token (leave empty if not using Sonarqube)',
      sensitive: true,
      skippable: true,
      prohibitedValues: [],
    },
  },
  artifactory: {
    artifactory_url: {
      description: 'Artifactory URL (Credentials Reference as it may contain sensitive values)',
      sensitive: true,
      prohibitedValues: [],
    },
  },
  jira: {
    jira_hostname: {description: 'Jira Hostname', dataType: 'hostname', prohibitedValues: []},
    jira_username: {description: 'Jira Username (leave empty if using PAT)', skippable: true, prohibitedValues: []},
    jira_password: {
      description: 'Jira Password Credentials Reference (leave empty if using PAT)',
      sensitive: true,
      skippable: true,
      prohibitedValues: [],
    },
    jira_pat: {
      description: 'JIRA Pat Reference (leave empty if using user/pass)',
      sensitive: true,
      skippable: true,
      prohibitedValues: [],
    },
  },
  nexus: {
    base_nexus_url: {
      description: 'Nexus URL (Credentials Reference as it may contain sensitive values)',
      sensitive: true,
      prohibitedValues: [],
    },
  },
  'azure-repos': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    azure_repos_host: {description: 'Azure Repos Hostname', dataType: 'hostname', prohibitedValues: []},
    azure_repos_token: {description: 'Azure Repos Token Credentials Reference', sensitive: true, prohibitedValues: []},
    azure_repos_org: {description: 'Azure Repos Org Name', prohibitedValues: []},
  },
  'bitbucket-server': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    bitbucket: {description: 'Bitbucket Hostname', dataType: 'hostname', prohibitedValues: []},
    bitbucket_username: {
      description: 'Bitbucket Username (leave empty if using PAT)',
      skippable: true,
      prohibitedValues: [],
    },
    bitbucket_password: {
      description: 'Bitbucket Password Credentials Reference (leave empty if using PAT)',
      sensitive: true,
      skippable: true,
      prohibitedValues: [],
    },
    bitbucket_pat: {
      description: 'Bitbucket Pat Credentials Reference (leave empty if using user/pass)',
      sensitive: true,
      skippable: true,
      prohibitedValues: [],
    },
  },
  github: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    github_token: {description: 'Github Token Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'github-enterprise': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    github: {description: 'GHE Hostname', dataType: 'hostname', prohibitedValues: ['github.com']},
    github_token: {description: 'Github Token Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'github-server-app': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    github: {description: 'Github Url', dataType: 'hostname', prohibitedValues: []},
    github_api: {description: 'Github Api Url', dataType: 'hostname', prohibitedValues: []},
    github_app_client_id: {description: 'Github App Client ID Credentials Refs', sensitive: true, prohibitedValues: []},
    github_app_id: {description: 'Github App ID', prohibitedValues: []},
    github_app_installation_id: {description: 'Github App Installation ID', prohibitedValues: []},
    github_app_private_pem_path: {description: 'Github Private Pem cert path', prohibitedValues: []},
  },
  'github-cloud-app': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    github: {description: 'Github Url', dataType: 'hostname', prohibitedValues: []},
    github_api: {description: 'Github Api Url', dataType: 'hostname', prohibitedValues: []},
    github_app_client_id: {description: 'Github App Client ID Credentials Refs', sensitive: true, prohibitedValues: []},
    github_app_id: {description: 'Github App ID', prohibitedValues: []},
    github_app_installation_id: {description: 'Github App Installation ID', prohibitedValues: []},
    github_app_private_pem_path: {description: 'Github Private Pem cert path', prohibitedValues: []},
  },
  gitlab: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    gitlab: {description: 'Gitlab Hostname', dataType: 'hostname', prohibitedValues: []},
    gitlab_token: {description: 'Gitlab Token Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  acr: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'artifactory-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'docker-hub': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'digitalocean-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_token: {description: 'CR Token Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  ecr: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_role_arn: {description: 'CR Role Arn', prohibitedValues: []},
    cr_region: {description: 'CR Region', prohibitedValues: []},
    cr_external_id: {description: 'CR External ID', prohibitedValues: []},
  },
  gcr: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'github-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'gitlab-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'google-artifact-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'harbor-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'nexus-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
  },
  'quay-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url', prohibitedValues: []},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'url', prohibitedValues: []},
    cr_base: {description: 'CR Base Url', dataType: 'hostname', prohibitedValues: []},
    cr_username: {description: 'CR Username', prohibitedValues: []},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true, prohibitedValues: []},
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
