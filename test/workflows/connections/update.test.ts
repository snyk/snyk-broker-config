import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import WorkflowsConnectionsUpdate from '../../../src/commands/workflows/connections/update' // Import the correct command
import {beforeStep, downArrow, orgId4, snykToken} from '../../test-utils/nock-utils' // Keep common utils
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils' // Keep stdin utils

describe('connection update workflow', () => {
  // Update describe block name
  const stdin = fstdin()
  before(beforeStep) // Keep the before step if it sets up necessary nocks

  it('runs workflow connection update', async () => {
    // Update test case name
    // @ts-ignore - Assuming Config type is needed, adjust if not
    const cfg: Config = {}
    const updateConnection = new WorkflowsConnectionsUpdate([], cfg) // Instantiate the correct command class
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        // TODO: Adjust the stdin sequence for the update workflow
        sendScenarioWithOutAutoEnter(stdin, [
          snykToken,
          '\n',
          'n',
          '\n',
          orgId4,
          '\n',
          '\n',
          'updated-name',
          '\n',
          '\n',
          '\n',
        ])
        return updateConnection.run()
      },
      {print: false}, // Keep print false for cleaner test output
    )
    // TODO: Update assertions based on the expected output of the update command
    expect(stdout).to.contain('Connection Update Workflow completed.') // Update expected output message
    expect(error).to.be.undefined
  })
})
