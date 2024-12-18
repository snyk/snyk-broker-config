import {getAccessibleTenants, getTenantRole} from '../../src/api/tenants'
import {expect} from 'chai'
import nock from 'nock'

describe('Tenants Api calls', () => {
  const tenantId = '00000000-0000-0000-0000-000000000000'
  const tenants = {
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
  const tenantRoles = {
    data: [
      {
        type: 'tenant_membership',
        id: '00000000-0000-0000-0000-000000000000',
        attributes: {
          created_at: '2024-07-23T11:39:10.568336Z',
        },
        relationships: {
          tenant: {
            data: {
              type: 'tenant',
              id: tenantId,
              attributes: {
                name: 'Snyk Support',
              },
            },
          },
          user: {
            data: {
              type: 'user',
              id: '00000000-0000-0000-0000-000000000000',
              attributes: {
                name: 'Name',
                username: 'email@snyk.io',
                email: 'email@snyk.io',
                login_method: 'samlp',
                account_type: 'user',
                active: true,
              },
            },
          },
          role: {
            data: {
              type: 'tenant_role',
              id: '00000000-0000-0000-0000-000000000000',
              attributes: {
                name: 'Tenant Admin',
              },
            },
          },
        },
      },
    ],
    jsonapi: {},
  }
  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    nock('https://api.snyk.io')
      .persist()
      .get('/rest/tenants?version=2024-10-14~experimental')
      .reply(() => {
        return [200, tenants]
      })
      .get(`/rest/tenants/${tenantId}/memberships?role_name=admin&version=2024-10-14~experimental`)
      .reply(() => {
        return [200, tenantRoles]
      })
  })
  it('getAccessibleTenants', async () => {
    const accessibleTenants = await getAccessibleTenants()
    expect(accessibleTenants).to.deep.equal(tenants)
  })

  it('getTenantRole', async () => {
    const tenantRoles = await getTenantRole(tenantId)
    expect(tenantRoles).to.deep.equal(tenantRoles)
  })
})
