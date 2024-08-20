import {Flags} from '@oclif/core'

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

export const connectionsData = {
  type: Flags.string({
    char: 't',
    description: 'Connection type',
    required: true,
    relationships: [
      {
        type: 'all',
        flags: [
          {
            name: 'broker_client_url',
            when: async (flags) => craConfigType1Types.has(flags['type'] as unknown as string),
          },
          {
            name: 'cr_agent_url',
            when: async (flags) => craConfigType1Types.has(flags['type'] as unknown as string),
          },
          {name: 'cr_base', when: async (flags) => craConfigType1Types.has(flags['type'] as unknown as string)},
          {
            name: 'cr_username',
            when: async (flags) => craConfigType1Types.has(flags['type'] as unknown as string),
          },
          {
            name: 'cr_password',
            when: async (flags) => craConfigType1Types.has(flags['type'] as unknown as string),
          },
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'apprisk'},
          {name: 'checkmarx', when: async (flags) => flags['type'] === 'apprisk'},
          {name: 'checkmarx_password', when: async (flags) => flags['type'] === 'apprisk'},
          {name: 'checkmarx_username', when: async (flags) => flags['type'] === 'apprisk'},
        ],
      },
      {
        type: 'all',
        flags: [{name: 'artifactory_url', when: async (flags) => flags['type'] === 'artifactory'}],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'azure-repos'},
          {name: 'azure_repos_token', when: async (flags) => flags['type'] === 'azure-repos'},
          {name: 'azure_repos_org', when: async (flags) => flags['type'] === 'azure-repos'},
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'bitbucket-server'},
          {name: 'bitbucket', when: async (flags) => flags['type'] === 'bitbucket-server'},
          {
            name: 'bitbucket_username',
            when: async (flags) => flags['type'] === 'bitbucket-server' && !flags['bitbucket_pat'],
          },
          {
            name: 'bitbucket_password',
            when: async (flags) => flags['type'] === 'bitbucket-server' && !flags['bitbucket_pat'],
          },
          {
            name: 'bitbucket_pat',
            when: async (flags) =>
              flags['type'] === 'bitbucket-server' && !flags['bitbucket_username'] && !flags['bitbucket_password'],
          },
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'digitalocean-cr'},
          {name: 'cr_agent_url', when: async (flags) => flags['type'] === 'digitalocean-cr'},
          {name: 'cr_base', when: async (flags) => flags['type'] === 'digitalocean-cr'},
          {name: 'cr_token', when: async (flags) => flags['type'] === 'digitalocean-cr'},
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'ecr'},
          {name: 'cr_agent_url', when: async (flags) => flags['type'] === 'ecr'},
          {name: 'cr_base', when: async (flags) => flags['type'] === 'ecr'},
          {name: 'cr_role_arn', when: async (flags) => flags['type'] === 'ecr'},
          {name: 'cr_region', when: async (flags) => flags['type'] === 'ecr'},
          {name: 'cr_external_id', when: async (flags) => flags['type'] === 'ecr'},
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'github'},
          {name: 'github_token', when: async (flags) => flags['type'] === 'github'},
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'github-enterprise'},
          {name: 'github', when: async (flags) => flags['type'] === 'github-enterprise'},
          {name: 'github_token', when: async (flags) => flags['type'] === 'github-enterprise'},
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'github-server-app'},
          {name: 'github', when: async (flags) => flags['type'] === 'github-server-app'},
          {name: 'github_api', when: async (flags) => flags['type'] === 'github-server-app'},
          {name: 'github_app_client_id', when: async (flags) => flags['type'] === 'github-server-app'},
          {name: 'github_app_id', when: async (flags) => flags['type'] === 'github-server-app'},
          {name: 'github_app_installation_id', when: async (flags) => flags['type'] === 'github-server-app'},
          {name: 'github_app_private_pem_path', when: async (flags) => flags['type'] === 'github-server-app'},
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'broker_client_url', when: async (flags) => flags['type'] === 'gitlab'},
          {name: 'gitlab', when: async (flags) => flags['type'] === 'gitlab'},
          {name: 'gitlab_token', when: async (flags) => flags['type'] === 'gitlab'},
        ],
      },
      {
        type: 'all',
        flags: [
          {name: 'jira_hostname', when: async (flags) => flags['type'] === 'jira'},
          {name: 'jira_username', when: async (flags) => flags['type'] === 'jira' && !flags['jira_pat']},
          {name: 'jira_password', when: async (flags) => flags['type'] === 'jira' && !flags['jira_path']},
          {
            name: 'jira_pat',
            when: async (flags) => flags['type'] === 'jira' && !flags['jira_username'] && !flags['jira_password'],
          },
        ],
      },
      {
        type: 'all',
        flags: [{name: 'base_nexus_url', when: async (flags) => flags['type'] === 'nexus'}],
      },
    ],
  }),
  name: Flags.string({
    char: 'n',
    description: 'Connection name',
    required: true,
  }),
  broker_client_url: Flags.string({
    description: 'Broker Client Url',
    required: false,
  }),
  cr_agent_url: Flags.string({
    description: 'CR Agent Url',
    required: false,
  }),
  cr_base: Flags.string({
    description: 'CR Base Url',
    required: false,
  }),
  cr_username: Flags.string({
    description: 'CR Username',
    required: false,
  }),
  cr_password: Flags.string({
    description: 'CR Password Credentials Reference',
    required: false,
  }),
  cr_token: Flags.string({
    description: 'CR Token Credentials Reference',
    required: false,
  }),
  cr_role_arn: Flags.string({
    description: 'CR Role Arn',
    required: false,
  }),
  cr_region: Flags.string({
    description: 'CR Region',
    required: false,
  }),
  cr_external_id: Flags.string({
    description: 'CR External Id',
    required: false,
  }),
  checkmarx: Flags.string({
    description: 'Checkmarx Url',
    required: false,
  }),
  checkmarx_username: Flags.string({
    description: 'Checkmarx username',
    required: false,
  }),
  checkmarx_password: Flags.string({
    description: 'Checkmarx Password Credentials Reference',
    required: false,
  }),
  artifactory_url: Flags.string({
    description: 'Artifactory URL (Credentials Reference as it may contain sensitive values)',
    required: false,
  }),
  azure_repos_token: Flags.string({
    description: 'Azure Repos token Credentials Reference',
    required: false,
  }),
  azure_repos_org: Flags.string({
    description: 'Azure Repos Org Name',
    required: false,
  }),
  bitbucket: Flags.string({
    description: 'Broker Client Url',
    required: false,
  }),
  bitbucket_pat: Flags.string({
    description: 'Broker Client Url',
    required: false,
  }),
  bitbucket_username: Flags.string({
    description: 'Broker Client Url',
    required: false,
  }),
  bitbucket_password: Flags.string({
    description: 'Broker Client Url',
    required: false,
  }),
  github: Flags.string({
    description: 'Github Url',
    required: false,
  }),
  github_token: Flags.string({
    description: 'Github Token Credentials Reference',
    required: false,
  }),
  github_api: Flags.string({
    description: 'Github Api Hostname',
    required: false,
  }),
  github_app_client_id: Flags.string({
    description: 'Github App Client Id Credentials Refs',
    required: false,
  }),
  github_app_id: Flags.string({
    description: 'Github App Id',
    required: false,
  }),
  github_app_installation_id: Flags.string({
    description: 'Github App Installation Id',
    required: false,
  }),
  github_app_private_pem_path: Flags.string({
    description: 'Github Private Pem cert path',
    required: false,
  }),
  gitlab: Flags.string({
    description: 'Gitlab Url',
    required: false,
  }),
  gitlab_token: Flags.string({
    description: 'Gitlab Token Credentials Reference',
    required: false,
  }),
  jira: Flags.string({
    description: 'Jira Hostname',
    required: false,
  }),
  jira_pat: Flags.string({
    description: 'Jira PAT Credentials Reference',
    required: false,
  }),
  jira_username: Flags.string({
    description: 'Jira Username',
    required: false,
  }),
  jira_password: Flags.string({
    description: 'Jira Password Credentials Reference',
    required: false,
  }),
  base_nexus_url: Flags.string({
    description: 'Nexus URL (Credentials Reference as it may contain sensitive values)',
    required: false,
  }),
}
