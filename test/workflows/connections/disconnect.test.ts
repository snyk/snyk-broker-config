import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/disconnect'
import {beforeStep, downArrow, snykToken, tab} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const disconnectConnection = new Connections([], cfg)
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
          tab,
          '\n',
          'y',
          '\n',
        ])
        return disconnectConnection.run()
      },
      {print: false},
    )
    expect(stdout).to.contain('Connection Integrate Workflow completed.')
  })
})
