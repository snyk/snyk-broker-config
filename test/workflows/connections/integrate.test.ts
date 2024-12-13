import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/integrate'
import {beforeStep, connectionId3, integrationId3, orgId3, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

const stdin = fstdin()

describe('deployment workflows', () => {
  before(beforeStep)

  it('runs workflow deployment create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const integrateConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId3, orgId3, integrationId3])
        return integrateConnection.run()
      },
      {print: false},
    )

    expect(stdout).to.contain(
      `Connection ${connectionId3} (type: github) integrated with integration ${integrationId3} on Org ${orgId3}.`,
    )
    expect(error).to.be.undefined
    expect(stdout).to.contain('Connection Integrate Workflow completed.')
  })
})
