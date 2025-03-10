import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/delete'
import {beforeStep, connectionId3, downArrow, snykToken} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment delete', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const deleteConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [snykToken, '\n', downArrow, downArrow, downArrow, '\n', 'y', '\n'])
        return deleteConnection.run()
      },
      {print: false},
    )
    expect(stderr).to.contain('')
    expect(error).to.be.undefined
    expect(stdout).to.contain(`Deleting Connection ${connectionId3}`)
    expect(stdout).to.contain('Connection Deletion Workflow completed.')
  })
})
