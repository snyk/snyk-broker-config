import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/integrate'
import {beforeStep, connectionId3, downArrow, integrationId3, orgId3, snykToken} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const integrateConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [snykToken, '\n', downArrow, downArrow, downArrow, '\n', orgId3, '\n'])
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
