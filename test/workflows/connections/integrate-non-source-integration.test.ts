import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/integrate'
import {beforeStep, connectionId4, downArrow, integrationId4, orgId4, snykToken} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow connection integrate', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const integrateConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [
          snykToken,
          '\n',
          downArrow,
          downArrow,
          downArrow,
          downArrow,
          '\n',
          downArrow,
          '\n',
          orgId4,
          '\n',
        ])
        return integrateConnection.run()
      },
      {print: false},
    )

    expect(stdout).to.contain(
      `Connection ${connectionId4} (type: nexus) integrated with integration ${integrationId4} on Org ${orgId4}.`,
    )
    expect(error).to.be.undefined
    expect(stdout).to.contain('Connection Integrate Workflow completed.')
  })
})
