import {getAccessibleTenants} from '../../src/api/tenants'
import {expect} from 'chai'
import nock from 'nock'

describe('Tenants Api calls', () => {
  const tenants = {
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
  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    nock('https://api.snyk.io')
      .persist()
      .get('/rest/tenants?version=2024-04-11~experimental')
      .reply(() => {
        return [200, tenants]
      })
  })
  it('getAccessibleTenants', async () => {
    const accessibleTenants = await getAccessibleTenants()
    expect(accessibleTenants).to.deep.equal(tenants)
  })
})
