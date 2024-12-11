import {
  createIntegrationForConnection,
  deleteIntegrationsForConnection,
  disconnectIntegrationForOrgIdAndIntegrationId,
  getIntegrationsForConnection,
} from '../../src/api/integrations'
import {expect} from 'chai'
import nock from 'nock'

describe('Integrations Api calls', () => {
  const apiResponseSchema = {data: {}, links: {}}
  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    nock('https://api.snyk.io')
      .persist()
      .get(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/integrations?version=2024-02-08~experimental',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        response.data = [
          {
            org_id: '00000000-0000-0000-0000-000000000000',
            id: '00000000-0000-0000-0000-000000000000',
            type: 'broker-integrations',
            integration_type: 'github',
          },
        ]
        return [200, response]
      })
      .post(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/orgs/00000000-0000-0000-0000-000000000000/integration?version=2024-02-08~experimental',
      )
      .reply((uri, body) => {
        const orgId = uri
          .replace(
            '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/orgs/',
            '',
          )
          .replace('/integration?version=2024-02-08~experimental', '')
        const bodyData = JSON.parse(body.toString()).data
        const response = apiResponseSchema
        response.data = [
          {
            org_id: orgId,
            id: '00000000-0000-0000-0000-000000000000',
            type: 'broker-integrations',
            integration_type: bodyData.type,
          },
        ]
        return [200, response]
      })
      .put('/v1/org/00000000-0000-0000-0000-000000000000/integrations/00000000-0000-0000-0000-000000000000')
      .reply((uri, body) => {
        return [200, {}]
      })
      .delete(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/orgs/00000000-0000-0000-0000-000000000000/integrations/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental',
      )
      .reply(() => {
        return [204]
      })
  })
  it('getIntegrationsForConnection', async () => {
    const response = apiResponseSchema
    response.data = [
      {
        org_id: '00000000-0000-0000-0000-000000000000',
        id: '00000000-0000-0000-0000-000000000000',
        type: 'broker-integrations',
        integration_type: 'github',
      },
    ]
    const gotIntegrations = await getIntegrationsForConnection(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    expect(gotIntegrations).to.deep.equal(response)
  })
  it('createIntegrationForConnection', async () => {
    const createdIntegrations = await createIntegrationForConnection(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      'gitlab',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    const response = apiResponseSchema
    response.data = [
      {
        org_id: '00000000-0000-0000-0000-000000000000',
        id: '00000000-0000-0000-0000-000000000000',
        type: 'broker-integrations',
        integration_type: 'gitlab',
      },
    ]
    expect(createdIntegrations).to.deep.equal(response)
  })

  it('disconnectIntegrationForOrgIdAndIntegrationId', async () => {
    try {
      await disconnectIntegrationForOrgIdAndIntegrationId(
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000000',
        'github',
      )
      expect(true).to.equal(true)
    } catch (err) {
      expect(err).to.be.null
    }
  })

  it('deleteIntegrationsForConnection', async () => {
    const deletedIntegrations = await deleteIntegrationsForConnection(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    expect(deletedIntegrations).to.equal(204)
  })
})
