import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Credentials from '../../../src/commands/workflows/credentials/get'
import {beforeStep, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

const stdin = fstdin()

describe('credentials workflows', () => {
  before(beforeStep)

  it('runs workflow credentials get', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const getCredentials = new Credentials([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId])
        return getCredentials.run()
      },
      {print: false},
    )
    expect(stderr).to.contain('')
    expect(error).to.be.undefined
    expect(stdout).to.contain('Found single accessible Tenant. Using 00000000-0000-0000-0000-000000000000.')
    expect(stdout).to.contain(
      'Now using Tenant Id 00000000-0000-0000-0000-000000000000 and Install Id 00000000-0000-0000-0000-000000000000.',
    )
    expect(stdout).to.contain('Now using Deployment 00000000-0000-0000-0000-000000000000.')
    expect(stdout).to.contain(
      'Getting Universal Broker Credentials for Deployment 00000000-0000-0000-0000-000000000000, Tenant 00000000-0000-0000-0000-000000000000, Install 00000000-0000-0000-0000-000000000000',
    )
    expect(stdout).to.contain(`- id: 00000000-0000-0000-0000-0000000000001
    attributes:
        comment: comment
        deployment_id: 00000000-0000-0000-0000-000000000000
        environment_variable_name: TEST_ENV_VAR
        type: github
`)
    expect(stdout).to.contain('Total = 1')

    expect(stdout).to.contain('Credentials Listing Workflow completed.')
  })
})
