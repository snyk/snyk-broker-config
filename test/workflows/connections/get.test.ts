import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/get'
import {beforeStep, downArrow, snykToken} from '../../test-utils/nock-utils'
import {sendScenario, sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('connections workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow connections list', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const getConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [snykToken, '\n', downArrow, downArrow, downArrow, '\n'])
        return getConnection.run()
      },
      {print: false},
    )
    expect(error).to.be.undefined
    expect(stdout).to.contain(`- id: 00000000-0000-0000-0000-000000000003
    attributes:
        deployment_id: 00000000-0000-0000-0000-000000000000
        identifier: 00000000-0000-0000-0000-000000000000
        name: test-conn
`)
    expect(stdout).to.contain('Connection Detail Workflow completed.')
  })
})
