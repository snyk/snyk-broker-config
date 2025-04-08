import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Contexts from '../../../src/commands/workflows/contexts/withdraw'
import {beforeStep, orgId4, snykToken, tab} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const withdraw = new Contexts([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId4, tab, 'y'])
        return withdraw.run()
      },
      {print: false},
    )

    expect(error).to.be.undefined

    expect(stdout).to.contain('Contexts Withdraw Workflow completed.')
  })
})
