import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/create'
import {beforeStep, downArrow, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('connection workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow connection create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const createConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [
          snykToken,
          '\n',
          'n',
          '\n',
          orgId,
          '\n',
          downArrow,
          downArrow,
          '\n',
          'test-conn',
          '\n',
          'http://broker.client.url',
          '\n',
          'http://artifactory.hostname',
          '\n',
          'artifactory-crbase.hostname',
          '\n',
          'username',
          '\n',
          'y',
          '\n',
          'ARTIFACTORY_PASSWORD',
          '\n',
          'dummy comment',
          '\n',
        ])
        return createConnection.run()
      },
      {print: false},
    )
    expect(stdout).to.contain('Connection Create Workflow completed.')
    expect(error).to.be.undefined
  })
})
