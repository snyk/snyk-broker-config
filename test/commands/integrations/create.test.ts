import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import nock from 'nock'
import IntegrationsCreate from '../../../src/commands/integrations/create'

describe('integrations create command', () => {
  const tenantId = '00000000-0000-0000-0000-000000000000'
  const installId = '00000000-0000-0000-0000-000000000000'
  const connectionId = '00000000-0000-0000-0000-0000000000bb'
  const orgId = '3a7c1ab9-8914-4f39-a8c0-5752af653a8a'
  const integrationId = '3a7c1ab9-8914-4f39-a8c0-5752af653a8a'
  const apiPath = `/rest/tenants/${tenantId}/brokers/connections/${connectionId}/orgs/${orgId}/integration`

  const mockConfig: any = {
    runHook: () => Promise.resolve({successes: [], failures: []}),
    runCommand: () => Promise.resolve(),
    scopedEnvVarKey: () => '',
    bin: 'snyk-broker-config',
    topicSeparator: ' ',
    pjson: {oclif: {topicSeparator: ' '}},
    plugins: new Map(),
  }

  beforeEach(() => {
    process.env.SNYK_TOKEN = 'dummy'
    process.env.TENANT_ID = tenantId
    process.env.INSTALL_ID = installId
  })

  afterEach(() => {
    delete process.env.SNYK_TOKEN
    delete process.env.TENANT_ID
    delete process.env.INSTALL_ID
    nock.cleanAll()
  })

  it('rejects a multi-profile type without an integration ID and sends no request', async () => {
    const scope = nock('https://api.snyk.io').post(apiPath).query(true).reply(201, {})
    // Class is loaded before env vars are set, so the tenantId and installId args are expected
    const cmd = new IntegrationsCreate([tenantId, installId, connectionId, orgId, '', 'ecr'], mockConfig)
    const {error} = await captureOutput(async () => cmd.run(), {print: false})

    expect(error?.message).to.contain('INTEGRATIONID')
    expect(scope.isDone()).to.be.false
  })

  it('sends the integration ID for a multi-profile type', async () => {
    let body: unknown
    nock('https://api.snyk.io')
      .post(apiPath, (b) => {
        body = b
        return true
      })
      .query(true)
      .reply(201, {data: {id: integrationId, org_id: orgId, type: 'broker_integration', integration_type: 'ecr'}})
    const cmd = new IntegrationsCreate([tenantId, installId, connectionId, orgId, integrationId, 'ecr'], mockConfig)
    const {error} = await captureOutput(async () => cmd.run(), {print: false})

    expect(error).to.be.undefined
    expect(body).to.deep.equal({data: {type: 'ecr', integration_id: integrationId}})
  })
})
