import nock from 'nock'
import {ConnectionResponse} from '../../src/api/types'

export const upArrow = '\u001b[A'
export const downArrow = '\u001b[B'
export const appId = 'cb43d761-bd17-4b44-9b6c-e5b8ad077d33'
export const snykToken = 'dummy'
export const orgId = '3a7c1ab9-8914-4f39-a8c0-5752af653a88'
export const orgId2 = '3a7c1ab9-8914-4f39-a8c0-5752af653a89'
export const tenantId = '00000000-0000-0000-0000-000000000000'
export const installId = '00000000-0000-0000-0000-000000000000'
export const installId2 = '00000000-0000-0000-0000-000000000002'
export const deploymentId = '00000000-0000-0000-0000-000000000000'
export const deploymentId2 = '00000000-0000-0000-0000-000000000002'
export const clientId = '00000000-1234-0000-0000-000000000000'
const createConnectionResponse: ConnectionResponse = {
  data: {
    id: '00000000-0000-0000-0000-000000000000',
    type: 'broker_connection',
    attributes: {},
  },
  jsonapi: {
    version: 'dummy',
  },
  links: {},
}
const updateConnectionResponse: ConnectionResponse = {
  data: {
    id: '00000000-0000-0000-0000-000000000000',
    type: 'broker_connection',
    attributes: {},
  },
  jsonapi: {
    version: 'dummy',
  },
  links: {},
}

export const tenants = {
  data: [
    {
      attributes: {
        created_at: 'date',
        name: 'test tenant',
        slug: 'test-tenant',
        updated_at: 'date',
      },
      id: tenantId,
      relationships: {
        owner: {
          data: {
            id: '00000000-0000-0000-0000-000000000000',
            type: '',
          },
        },
      },
      type: 'tenant',
    },
  ],
}

export const appResponse = {
  data: [
    {
      id: `00000000-0000-0000-0000-000000000000`,
      type: 'app_install',
      attributes: {
        client_id: clientId,
        installed_at: '2024-07-17T18:51:02Z',
      },
      relationships: {
        app: {
          data: {
            id: appId,
            type: 'app',
          },
        },
      },
    },
  ],
}
export const appResponse2 = {
  data: [
    {
      id: `00000000-0000-0000-0000-000000000002`,
      type: 'app_install',
      attributes: {
        client_id: clientId,
        installed_at: '2024-07-17T18:51:02Z',
      },
      relationships: {
        app: {
          data: {
            id: appId,
            type: 'app',
          },
        },
      },
    },
  ],
}

export const createCredentialsResponse = {
  data: [
    {
      attributes: {
        comment: '',
        deployment_id: '',
        environment_variable_name: '',
        type: '',
      },
      id: '00000000-0000-0000-0000-0000000000001',
    },
  ],
}

const urlPrefixTenantIdAndInstallId = `/rest/tenants/${tenantId}/brokers/installs/${installId}`
const urlPrefixTenantIdAndInstallId2 = `/rest/tenants/${tenantId}/brokers/installs/${installId2}`

export const beforeStep = () => {
  const apiResponseSchema = {data: {}, links: {}}
  nock('https://api.snyk.io')
    .persist()
    .get(`/rest/orgs/${orgId}/apps/installs?version=2024-05-31`)
    .reply(() => {
      return [200, appResponse]
    })
    .get(`/rest/orgs/${orgId2}/apps/installs?version=2024-05-31`)
    .reply(() => {
      return [200, appResponse2]
    })
    .get('/rest/tenants?version=2024-04-11~experimental')
    .reply(() => {
      return [200, tenants]
    })
    .get(`${urlPrefixTenantIdAndInstallId}/deployments?version=2024-02-08~experimental`)
    .reply((uri, body) => {
      const response = apiResponseSchema
      response.data = [
        {
          attributes: {
            broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
            install_id: '00000000-0000-0000-0000-000000000000',
            metadata: {},
          },
          id: '00000000-0000-0000-0000-000000000000',
          type: 'broker_deployment',
        },
      ]
      return [200, response]
    })
    .get(`${urlPrefixTenantIdAndInstallId2}/deployments?version=2024-02-08~experimental`)
    .reply((uri, body) => {
      const response = apiResponseSchema
      response.data = [
        {
          attributes: {
            broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
            install_id: '00000000-0000-0000-0000-000000000002',
            metadata: {},
          },
          id: '00000000-0000-0000-0000-000000000002',
          type: 'broker_deployment',
        },
      ]
      return [200, response]
    })
    .get(`${urlPrefixTenantIdAndInstallId}/deployments/${deploymentId}/connections?version=2024-02-08~experimental`)
    .reply((uri, body) => {
      const response = apiResponseSchema
      response.data = [
        // {
        //   attributes: {
        //     broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
        //     install_id: '00000000-0000-0000-0000-000000000000',
        //     metadata: {},
        //   },
        //   id: '00000000-0000-0000-0000-000000000000',
        //   type: 'broker_deployment',
        // },
      ]
      return [200, response]
    })
    .get(`${urlPrefixTenantIdAndInstallId2}/deployments/${deploymentId2}/connections?version=2024-02-08~experimental`)
    .reply((uri, body) => {
      const response = apiResponseSchema
      response.data = []
      return [200, response]
    })
    .get(`${urlPrefixTenantIdAndInstallId}/deployments/${deploymentId}/credentials?version=2024-02-08~experimental`)
    .reply((uri, body) => {
      const createCredentialsNockResponse = {
        ...createCredentialsResponse,
      }

      createCredentialsNockResponse.data[0].attributes.comment = 'comment'
      createCredentialsNockResponse.data[0].attributes.environment_variable_name = 'TEST_ENV_VAR'
      createCredentialsNockResponse.data[0].attributes.type = 'github'
      createCredentialsNockResponse.data[0].attributes.deployment_id = '00000000-0000-0000-0000-000000000000'

      return [200, createCredentialsNockResponse]
    })
    .get(`${urlPrefixTenantIdAndInstallId2}/deployments/${deploymentId2}/credentials?version=2024-02-08~experimental`)
    .reply((uri, body) => {
      const response = apiResponseSchema
      response.data = []

      return [200, response]
    })
    .post(`${urlPrefixTenantIdAndInstallId}/deployments?version=2024-02-08~experimental`)
    .reply((uri, body) => {
      const response = apiResponseSchema
      response.data = {
        attributes: {
          broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
          install_id: '00000000-0000-0000-0000-000000000000',
          metadata: {key: 'value'},
        },
        id: '00000000-0000-0000-0000-000000000000',
        type: 'broker_deployment',
      }
      return [200, response]
    })
    .post(
      `${urlPrefixTenantIdAndInstallId}/deployments/00000000-0000-0000-0000-000000000000/connections?version=2024-02-08~experimental`,
    )
    .reply((uri, body) => {
      const createNockResponse = {
        ...createConnectionResponse,
      }
      createNockResponse.data.attributes = JSON.parse(body.toString()).data.attributes
      createNockResponse.data.id = '00000000-0000-0000-0000-000000000000'
      return [200, createNockResponse]
    })
    .post(
      `${urlPrefixTenantIdAndInstallId}/deployments/00000000-0000-0000-0000-000000000000/credentials?version=2024-02-08~experimental`,
    )
    .reply((uri, body) => {
      const createCredentialsNockResponse = {
        ...createCredentialsResponse,
      }
      const credsValues = JSON.parse(body.toString()).data.attributes[0]

      createCredentialsNockResponse.data[0].attributes.comment = credsValues.comment
      createCredentialsNockResponse.data[0].attributes.environment_variable_name = credsValues.environment_variable_name
      createCredentialsNockResponse.data[0].attributes.type = credsValues.type
      createCredentialsNockResponse.data[0].attributes.deployment_id = '00000000-0000-0000-0000-000000000000'
      return [200, JSON.stringify(createCredentialsNockResponse)]
    })
    .patch(
      `${urlPrefixTenantIdAndInstallId}/deployments/00000000-0000-0000-0000-000000000000/connections/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental`,
    )
    .reply((uri, body) => {
      const updateNockResponse = {
        ...updateConnectionResponse,
      }
      updateNockResponse.data.attributes = JSON.parse(body.toString()).data.attributes
      updateNockResponse.data.id = '00000000-0000-0000-0000-000000000000'
      return [200, updateNockResponse]
    })

    .patch(
      `${urlPrefixTenantIdAndInstallId}/deployments/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental`,
    )
    .reply((uri, body) => {
      const response = apiResponseSchema
      const attributes = {
        broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
        install_id: '00000000-0000-0000-0000-000000000000',
        ...JSON.parse(body.toString()).data.attributes,
      }
      response.data = {
        attributes: attributes,
        id: '00000000-0000-0000-0000-000000000000',
        type: 'broker_deployment',
      }
      return [200, response]
    })
    .delete(
      `${urlPrefixTenantIdAndInstallId}/deployments/00000000-0000-0000-0000-000000000000/connections/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental`,
    )
    .reply(() => {
      return [204]
    })
    .delete(
      `${urlPrefixTenantIdAndInstallId}/deployments/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental`,
    )
    .reply(() => {
      return [204]
    })
    .delete(
      `${urlPrefixTenantIdAndInstallId2}/deployments/00000000-0000-0000-0000-000000000002?version=2024-02-08~experimental`,
    )
    .reply(() => {
      return [204]
    })
}
