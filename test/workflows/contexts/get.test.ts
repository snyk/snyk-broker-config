import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Contexts from '../../../src/commands/workflows/contexts/get'
import {beforeStep, orgId3, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('contexts workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow context get', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const getContext = new Contexts([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId3])

        return getContext.run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stdout.replaceAll(' ', '')).to.contain(
      `- id: 00000000-0000-0000-0000-000000000003
    context:
        broker_client_url: https://my.broker.client:8000`.replaceAll(' ', ''),
    )
    expect(stdout).to.contain('Contexts Get Workflow completed.')
  })
})
