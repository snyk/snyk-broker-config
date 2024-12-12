import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Deployments from '../../../src/commands/workflows/deployments/create'
import {beforeStep, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

const stdin = fstdin()

describe('deployment workflows', () => {
  before(beforeStep)

  it('runs workflow deployment create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const createDeployment = new Deployments([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId, 'y', 'key', 'value', 'n'])
        return createDeployment.run()
      },
      {print: false},
    )
    expect(stderr).to.contain('')
    expect(error).to.be.undefined
    expect(stdout).to.contain(`- id: 00000000-0000-0000-0000-000000000000
    attributes:
        broker_app_installed_in_org_id: 00000000-0000-0000-0000-000000000000
        install_id: 00000000-0000-0000-0000-000000000000
        metadata:
            key: value


    type: broker_deployment
`)
    expect(stdout).to.contain('Deployment Create Workflow completed.')
  })
})
