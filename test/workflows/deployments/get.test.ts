import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Deployments from '../../../src/commands/workflows/deployments/get'
import {beforeStep, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  before(beforeStep)

  it('runs workflow deployment list', async () => {
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
    expect(stderr).to.contain('')
    expect(error).to.be.undefined
    expect(stdout).to.contain(`0:
      
      - id: 00000000-0000-0000-0000-000000000000
        attributes:
            broker_app_installed_in_org_id: 00000000-0000-0000-0000-000000000000
            install_id: 00000000-0000-0000-0000-000000000000
            metadata:


        type: broker_deployment
`)
    expect(stdout).to.contain('Get Deployments Workflow completed.')
  })
})
