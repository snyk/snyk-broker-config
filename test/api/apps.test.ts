import {installAppIdOnOrgId, getExistingAppInstalledOnOrgId} from '../../src/api/apps'
import {expect} from 'chai'
import nock from 'nock'

describe('Broker App Api calls', () => {
  const response = {
    data: [
      {
        id: `123`,
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
  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    nock('https://api.snyk.io')
      .persist()
      .get(`/rest/orgs/00000000-0000-0000-0000-00000000000/apps/installs?version=2024-05-31`)
      .reply(() => {
        return [200, response]
      })
      .post('/rest/orgs/00000000-0000-0000-0000-000000000000/apps/installs?version=2024-05-31')
      .reply((uri) => {
        return [200, response]
      })
  })
  it('install broker app', async () => {
    const appInstallResponse = await installAppIdOnOrgId('00000000-0000-0000-0000-000000000000')
    expect(appInstallResponse).to.deep.equal(response)
  })

  it('get installed broker app', async () => {
    const orgId = '00000000-0000-0000-0000-00000000000'
    const installedApp = await getExistingAppInstalledOnOrgId(orgId)
    expect(installedApp).to.deep.equal(response.data[0])
  })

  it('returns undefined when no apps are installed', async () => {
    const orgId = 'no-apps-installed-org-id'

    nock('https://api.snyk.io')
      .get(`/rest/orgs/${orgId}/apps/installs?version=2024-05-31`)
      .reply(200, {data: []})

    const installedApp = await getExistingAppInstalledOnOrgId(orgId)
    expect(installedApp).to.be.undefined
  })

  it('returns undefined when SNYK_BROKER_APP_ID does not match any installed app', async () => {
    const responseWithDifferentApps = {
      data: [
        {
          id: `456`,
          type: 'app_install',
          attributes: {
            client_id: '11111111-1234-0000-0000-000000000000',
            installed_at: '2024-07-17T18:51:02Z',
          },
          relationships: {
            app: {
              data: {
                id: 'different-app-id-1234-5678-9abc-def012345678',
                type: 'app',
              },
            },
          },
        },
      ],
    }

    const orgId = 'apps-installed-org-id'
    nock('https://api.snyk.io')
      .get(`/rest/orgs/${orgId}/apps/installs?version=2024-05-31`)
      .reply(200, responseWithDifferentApps)


    const installedApp = await getExistingAppInstalledOnOrgId(orgId)
    expect(installedApp).to.be.undefined
  })
})
