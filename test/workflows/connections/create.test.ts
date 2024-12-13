import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/create'
import {beforeStep, downArrow, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

const stdin = fstdin()

describe('deployment workflows', () => {
  before(beforeStep)

  it('runs workflow deployment create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const createConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [
          snykToken,
          'n',
          orgId,
          downArrow,
          'test-conn',
          'http://broker.client.url',
          'http://artifactory.hostname',
          'artifactory-crbase.hostname',
          'username',
          'y',
          'ARTIFACTORY_PASSWORD',
          'dummy comment',
        ])
        return createConnection.run()
      },
      {print: false},
    )
    expect(stdout).to.contain('Connection Create Workflow completed.')
    expect(error).to.be.undefined
  })
})
