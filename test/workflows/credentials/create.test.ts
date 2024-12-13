import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Credentials from '../../../src/commands/workflows/credentials/create'
import {beforeStep, downArrow, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('credentials workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow credentials get', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const createCredentials = new Credentials([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId, downArrow, 'ARTIFACTORY_CR_CREDS_ENV_VAR', 'test env var name'])
        return createCredentials.run()
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
      'Creating Universal Broker Credentials for Deployment 00000000-0000-0000-0000-000000000000 for Tenant 00000000-0000-0000-0000-000000000000, Install 00000000-0000-0000-0000-000000000000',
    )
    expect(stdout).to.contain(`- id: 00000000-0000-0000-0000-0000000000001
        attributes:
            comment: test env var name
            deployment_id: 00000000-0000-0000-0000-000000000000
            environment_variable_name: ARTIFACTORY_CR_CREDS_ENV_VAR
            type: artifactory-cr`)

    expect(stdout).to.contain('Credentials Create Workflow completed.')
  })
})
