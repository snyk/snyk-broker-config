import nock from 'nock'
import {ConnectionResponse} from '../../src/api/types'

export const upArrow = '\u001b[A'
export const downArrow = '\u001b[B'
export const appId = 'cb43d761-bd17-4b44-9b6c-e5b8ad077d33'
export const snykToken = 'dummy'
export const orgId = '3a7c1ab9-8914-4f39-a8c0-5752af653a88'
export const tenantId = '00000000-0000-0000-0000-000000000000'
export const installId = '00000000-0000-0000-0000-000000000000'
export const deploymentId = '00000000-0000-0000-0000-000000000000'
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

const urlPrefixTenantIdAndInstallId = `/rest/tenants/${tenantId}/brokers/installs/${installId}`

export const beforeStep = () => {
  const apiResponseSchema = {data: {}, links: {}}
  nock('https://api.snyk.io')
    .persist()
    .get(`/rest/orgs/${orgId}/apps/installs?version=2024-05-31`)
    .reply(() => {
      return [200, appResponse]
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
    .get(`${urlPrefixTenantIdAndInstallId}/deployments/${deploymentId}/credentials?version=2024-02-08~experimental`)
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
}
