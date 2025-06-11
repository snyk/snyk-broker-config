import {
  createConnectionForDeployment,
  updateConnectionForDeployment,
  deleteConnectionForDeployment,
  getBulkMigrationOrgs,
} from '../../src/api/connections'
import {expect} from 'chai'
import nock from 'nock'
import {ConnectionResponse, GetOrgsForBulkMigrationResponse, OrgResource} from '../../src/api/types' // Added imports

describe('Connections Api calls', () => {
  const createResponse: ConnectionResponse = {
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
  const updateResponse: ConnectionResponse = {
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
  const bulkMigrationMockResponse: GetOrgsForBulkMigrationResponse = {
    data: [
      {id: 'org-uuid-for-bulk-1', type: 'org_id'},
      {id: 'org-uuid-for-bulk-2', type: 'org_id'},
    ],
    jsonapi: {version: 'dummy'},
    links: {},
  }
  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    nock('https://api.snyk.io')
      .persist()
      .post(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/connections?version=2024-10-15',
      )
      .reply((uri, body) => {
        const createNockResponse = {
          ...createResponse,
        }
        createNockResponse.data.attributes = JSON.parse(body.toString()).data.attributes
        createNockResponse.data.id = '00000000-0000-0000-0000-000000000000'
        return [200, createNockResponse]
      })
      .patch(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/connections/00000000-0000-0000-0000-000000000000?version=2024-10-15',
      )
      .reply((uri, body) => {
        const updateNockResponse = {
          ...updateResponse,
        }
        updateNockResponse.data.attributes = JSON.parse(body.toString()).data.attributes
        updateNockResponse.data.id = '00000000-0000-0000-0000-000000000000'
        return [200, updateNockResponse]
      })
      .delete(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/connections/00000000-0000-0000-0000-000000000000?version=2024-10-15',
      )
      .reply(() => {
        return [204]
      })
      .get(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/connections/00000000-0000-0000-0000-000000000000/bulk_migration?version=2024-10-15',
      )
      .reply(200, bulkMigrationMockResponse)
  })
  it('createConnectionForDeployment', async () => {
    const createConnectionResponse = await createConnectionForDeployment(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      'conn test',
      'github',
      {},
    )
    const createNockResponse = createResponse
    createNockResponse.data = {
      id: '00000000-0000-0000-0000-000000000000',
      type: 'broker_connection',
      attributes: {
        name: 'conn test',
        deployment_id: '00000000-0000-0000-0000-000000000000',
        configuration: {required: {}, type: 'github'},
      },
    }
    expect(createConnectionResponse).to.deep.equal(createNockResponse)
  })

  it('updateConnectionForDeployment', async () => {
    const updateConnectionResponse = await updateConnectionForDeployment(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      'conn test 2',
      'github',
      {},
    )
    const updateNockResponse = updateResponse
    updateNockResponse.data = {
      id: '00000000-0000-0000-0000-000000000000',
      type: 'broker_connection',
      attributes: {
        name: 'conn test 2',
        deployment_id: '00000000-0000-0000-0000-000000000000',
        configuration: {required: {}, type: 'github'},
      },
    }
    expect(JSON.parse(updateConnectionResponse)).to.deep.equal(updateNockResponse)
  })

  it('deleteConnectionForDeployment', async () => {
    const responseCode = await deleteConnectionForDeployment(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    expect(responseCode).to.equal(204)
  })

  it('getBulkMigrationOrgs', async () => {
    const response = await getBulkMigrationOrgs(
      '00000000-0000-0000-0000-000000000000', // tenantId
      '00000000-0000-0000-0000-000000000000', // installId
      '00000000-0000-0000-0000-000000000000', // deploymentId
      '00000000-0000-0000-0000-000000000000', // connectionId
    )
    expect(response).to.deep.equal(bulkMigrationMockResponse)
  })
})
