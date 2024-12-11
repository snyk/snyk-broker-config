import nock from 'nock'

export const upArrow = '\u001b[A'
export const downArrow = '\u001b[B'
export const snykToken = 'dummy'
export const orgId = '3a7c1ab9-8914-4f39-a8c0-5752af653a88'

export const tenants = {
  data: [
    {
      attributes: {
        created_at: 'date',
        name: 'test tenant',
        slug: 'test-tenant',
        updated_at: 'date',
      },
      id: '00000000-0000-0000-0000-000000000000',
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
        client_id: '00000000-1234-0000-0000-000000000000',
        installed_at: '2024-07-17T18:51:02Z',
      },
      relationships: {
        app: {
          data: {
            id: 'cb43d761-bd17-4b44-9b6c-e5b8ad077d33',
            type: 'app',
          },
        },
      },
    },
  ],
}

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
    .get(
      '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments?version=2024-02-08~experimental',
    )
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
    .post(
      '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments?version=2024-02-08~experimental',
    )
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
    .patch(
      '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental',
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
      '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental',
    )
    .reply(() => {
      return [204]
    })
}
