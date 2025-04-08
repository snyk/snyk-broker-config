import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Contexts from '../../../src/commands/workflows/contexts/create'
import {beforeStep, downArrow, orgId3, snykToken, tab} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('context workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow context create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const createConnection = new Contexts([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [
          snykToken,
          '\n',
          'n',
          '\n',
          orgId3,
          '\n',
          tab,
          '\n',
          'http://my.broker.client:8000',
          '\n',
        ])
        return createConnection.run()
      },
      {print: false},
    )
    expect(stdout).to.contain('Context Create Workflow completed.')
    expect(error).to.be.undefined
    expect(stdout.replaceAll(' ', '')).to.contain(
      `- id: 00000000-0000-0000-0000-000000000003
    type: broker-context
    attributes:
        context:
            broker_client_url: https://my.broker.client:8000


    relationships:
        broker_connections:

          - id: 00000000-0000-0000-0000-000000000003
            type: broker_connection`.replaceAll(' ', ''),
    )
  })
})
