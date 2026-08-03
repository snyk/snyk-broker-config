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
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/integrations?version=2024-10-15',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        response.data = [
          {
            org_id: '00000000-0000-0000-0000-000000000000',
            id: '00000000-0000-0000-0000-000000000000',
            type: 'broker_integration',
            integration_type: 'github',
          },
        ]
        return [200, response]
      })
      .post(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/orgs/00000000-0000-0000-0000-000000000000/integration?version=2024-10-15',
      )
      .reply((uri, body) => {
        const orgId = uri
          .replace(
            '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/orgs/',
            '',
          )
          .replace('/integration?version=2024-10-15', '')
        const bodyData = JSON.parse(body.toString()).data
        const response = apiResponseSchema
        response.data = [
          {
            org_id: orgId,
            id: '00000000-0000-0000-0000-000000000000',
            type: 'broker_integration',
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
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/orgs/00000000-0000-0000-0000-000000000000/integrations/00000000-0000-0000-0000-000000000000?version=2024-10-15',
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
        type: 'broker_integration',
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
        type: 'broker_integration',
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

// CN-1559: a connection must be bindable to a *specific* integration
// (org_source / profile) by integration_id so that, when an Org already has
// multiple integrations of the same type, we target the right org_source
// instead of resolving by type alone (which overwrites the existing one).
describe('createIntegrationForConnection - integration_id binding', () => {
  const tenantId = '00000000-0000-0000-0000-0000000000aa'
  const connectionId = '00000000-0000-0000-0000-0000000000bb'
  const orgId = '00000000-0000-0000-0000-0000000000cc'
  const integrationId = '00000000-0000-0000-0000-0000000000dd'
  const apiPath = `/rest/tenants/${tenantId}/brokers/connections/${connectionId}/orgs/${orgId}/integration`
  const okResponse = {
    data: {org_id: orgId, id: integrationId, type: 'ecr', integration_type: 'ecr'},
    jsonapi: {version: '1.0'},
    links: {},
  }

  beforeEach(() => {
    process.env.SNYK_TOKEN = 'dummy'
  })

  afterEach(() => {
    nock.cleanAll()
    delete process.env.SNYK_TOKEN
  })

  it('includes integration_id in the request body when one is provided', async () => {
    let capturedBody: unknown
    nock('https://api.snyk.io')
      .post(apiPath, (body) => {
        capturedBody = body
        return true
      })
      .query(true)
      .reply(201, okResponse)

    await createIntegrationForConnection(tenantId, connectionId, 'ecr', orgId, integrationId)

    expect(capturedBody).to.deep.equal({data: {type: 'ecr', integration_id: integrationId}})
  })

  it('omits integration_id from the request body when none is provided', async () => {
    let capturedBody: unknown
    nock('https://api.snyk.io')
      .post(apiPath, (body) => {
        capturedBody = body
        return true
      })
      .query(true)
      .reply(201, okResponse)

    await createIntegrationForConnection(tenantId, connectionId, 'ecr', orgId)

    expect(capturedBody).to.deep.equal({data: {type: 'ecr'}})
  })
})
