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
    }
  }
}

export const flagConnectionMapping: TypeMapping = {
  apprisk: {
    checkmarx: {
      description: 'Checkmarx Hostname (leave empty if not using Checkmarx)',
      dataType: 'hostname',
      skippable: true,
    },
    checkmarx_password: {
      description: 'Checkmarx Password Credentials Reference (leave empty if not using Checkmarx)',
      sensitive: true,
      skippable: true,
    },
    checkmarx_username: {description: 'Checkmarx Username (leave empty if not using Checkmarx)', skippable: true},
    sonar_qube_host_url: {
      description: 'Sonarqube Hostname (leave empty if not using Sonarqube)',
      dataType: 'hostname',
      skippable: true,
    },
    sonar_qube_api_token: {
      description: 'Sonarqube Api token (leave empty if not using Sonarqube)',
      sensitive: true,
      skippable: true,
    },
  },
  artifactory: {
    artifactory_url: {
      description: 'Artifactory URL (Credentials Reference as it may contain sensitive values)',
      sensitive: true,
    },
  },
  jira: {
    jira_hostname: {description: 'Jira Hostname', dataType: 'hostname'},
    jira_username: {description: 'Jira Username (leave empty if using PAT)', skippable: true},
    jira_password: {
      description: 'Jira Password Credentials Reference (leave empty if using PAT)',
      sensitive: true,
      skippable: true,
    },
    jira_pat: {description: 'JIRA Pat Reference (leave empty if using user/pass)', sensitive: true, skippable: true},
  },
  nexus: {
    base_nexus_url: {
      description: 'Nexus URL (Credentials Reference as it may contain sensitive values)',
      sensitive: true,
    },
  },
  'azure-repos': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    azure_repos_token: {description: 'Azure Repos Token Credentials Reference', sensitive: true},
    azure_repos_org: {description: 'Azure Repos Org Name'},
  },
  'bitbucket-server': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    bitbucket: {description: 'Bitbucket Hostname', dataType: 'hostname'},
    bitbucket_username: {description: 'Bitbucket Username (leave empty if using PAT)', skippable: true},
    bitbucket_password: {
      description: 'Bitbucket Password Credentials Reference (leave empty if using PAT)',
      sensitive: true,
      skippable: true,
    },
    bitbucket_pat: {
      description: 'Bitbucket Pat Credentials Reference (leave empty if using user/pass)',
      sensitive: true,
      skippable: true,
    },
  },
  github: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    github_token: {description: 'Github Token Credentials Reference', sensitive: true},
  },
  'github-enterprise': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    github: {description: 'GHE Hostname', dataType: 'hostname'},
    github_token: {description: 'Github Token Credentials Reference', sensitive: true},
  },
  'github-server-app': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    github: {description: 'Github Url', dataType: 'hostname'},
    github_api: {description: 'Github Api Url', dataType: 'hostname'},
    github_app_client_id: {description: 'Github App Client ID Credentials Refs', sensitive: true},
    github_app_id: {description: 'Github App ID'},
    github_app_installation_id: {description: 'Github App Installation ID'},
    github_app_private_pem_path: {description: 'Github Private Pem cert path'},
  },
  'github-cloud-app': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    github: {description: 'Github Url', dataType: 'hostname'},
    github_api: {description: 'Github Api Url', dataType: 'hostname'},
    github_app_client_id: {description: 'Github App Client ID Credentials Refs', sensitive: true},
    github_app_id: {description: 'Github App ID'},
    github_app_installation_id: {description: 'Github App Installation ID'},
    github_app_private_pem_path: {description: 'Github Private Pem cert path'},
  },
  gitlab: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    gitlab: {description: 'Gitlab Hostname', dataType: 'hostname'},
    gitlab_token: {description: 'Gitlab Token Credentials Reference', sensitive: true},
  },
  acr: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'artifactory-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'docker-hub': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'digitalocean-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_token: {description: 'CR Token Credentials Reference', sensitive: true},
  },
  ecr: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_role_arn: {description: 'CR Role Arn'},
    cr_region: {description: 'CR Region'},
    cr_external_id: {description: 'CR External ID'},
  },
  gcr: {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'github-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'gitlab-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'google-artifact-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'harbor-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'nexus-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
    cr_username: {description: 'CR Username'},
    cr_password: {description: 'CR Password Credentials Reference', sensitive: true},
  },
  'quay-cr': {
    broker_client_url: {description: 'Broker Client Url', dataType: 'url'},
    cr_agent_url: {description: 'CR Agent Url', dataType: 'hostname'},
    cr_base: {description: 'CR Base Url', dataType: 'hostname'},
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
