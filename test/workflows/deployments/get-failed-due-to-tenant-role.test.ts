import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Deployments from '../../../src/commands/workflows/deployments/get'
import {beforeStep, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  before(beforeStep)

  after(() => {
    delete process.env.TENANT_ID
  })
  it('runs workflow deployment list', async () => {
    process.env.TENANT_ID = '00000000-0000-0000-0000-000000000001'
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
      'This tool requires tenant admin role. Please use a tenant level admin account or upgrade your account to be tenant admin.',
    )
  })
})
