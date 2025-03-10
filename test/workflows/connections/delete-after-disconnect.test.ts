import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/delete'
import {beforeStep, connectionId4, downArrow, integrationId4, orgId4, snykToken} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment delete after disconnecting integrations', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const deleteConnection = new Connections([], cfg)
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
          'y',
          '\n',
          'y',
          '\n',
          'y',
          '\n',
        ])

        return deleteConnection.run()
      },
      {print: false},
    )
    expect(error).to.be.undefined
    expect(stdout).to.contain(`Disconnecting integration ${integrationId4} in org ${orgId4}`)
    expect(stdout).to.contain(`✔ Disconnected.`)
    expect(stdout).to.contain(`Selected Connection ID ${connectionId4}. Ready to delete Connection.`)
    expect(stdout).to.contain(`Deleting Connection ${connectionId4}`)
    expect(stdout).to.contain(`Connection Deletion Workflow completed.`)
  })
})
