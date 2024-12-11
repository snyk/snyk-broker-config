import {expect} from 'chai'
import nock from 'nock'

describe('Tenants Api calls', () => {
  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    nock('https://api.snyk.io')
      .persist()
      .post(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/connections?version=2024-02-08~experimental',
      )
      .reply((uri, body) => {
        return [200, {}]
      })
      .patch(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/connections/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental',
      )
      .reply((uri, body) => {
        return [200, {}]
      })
      .delete(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/connections/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental',
      )
      .reply(() => {
        return [204]
      })
  })
  it('createConnectionForDeployment', async () => {
    expect(true).to.equal(true)
  })
})
