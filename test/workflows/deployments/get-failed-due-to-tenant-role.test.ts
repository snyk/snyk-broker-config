import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Deployments from '../../../src/commands/workflows/deployments/get'
import {beforeStep, orgId, snykToken, nonAdminTenantId} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  before(beforeStep)

  after(() => {
    delete process.env.TENANT_ID
  })
  it('runs workflow deployment list', async () => {
    process.env.TENANT_ID = nonAdminTenantId
    const stdin = fstdin()
    // @ts-ignore
    const cfg: Config = {}
    const getDeployment = new Deployments([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId])

        return getDeployment.run()
      },
      {print: false},
    )
    expect(error?.message).to.contain(
      'This tool requires Tenant Admin role. Please use a Tenant level Admin account or upgrade your account to be Tenant Admin.',
    )
  })
})
