import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import nock from 'nock'
import Credentials from '../../../src/commands/credentials/list'

describe('credentials list command', () => {
  const tenantId = '00000000-0000-0000-0000-000000000000'
  const installId = '00000000-0000-0000-0000-000000000000'
  const deploymentId = 'invalid-deployment-id'

  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    process.env.TENANT_ID = tenantId
    process.env.INSTALL_ID = installId
  })

  after(() => {
    delete process.env.SNYK_TOKEN
    delete process.env.TENANT_ID
    delete process.env.INSTALL_ID
    nock.cleanAll()
  })

  it('handles invalid deployment ID gracefully (404 response with no data)', async () => {
    nock('https://api.snyk.io')
      .get(`/rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials`)
      .query(true)
      .reply(404, {
        errors: [{
            status: "404",
            title: "Not Found",
            detail: "Deployment not found"
        }]
      })

    const mockConfig: any = {
        runHook: () => Promise.resolve({successes: [], failures: []}),
        runCommand: () => Promise.resolve(),
        scopedEnvVarKey: () => '',
        bin: 'snyk-broker-config',
        topicSeparator: ' ',
        pjson: {
            oclif: {
                topicSeparator: ' ',
            }
        },
        plugins: new Map(),
    }

    // Since class is loaded before env vars are set, args definition expects tenantId and installId
    const cmd = new Credentials([tenantId, installId, deploymentId], mockConfig)

    const {error, stdout} = await captureOutput(async () => cmd.run(), {print: false})
    if (error) {
        throw new Error(`Command failed unexpectedly: ${error.message}`)
    }
    expect(stdout).to.contain('Total = 0')
  })
})
