import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Contexts from '../../../src/commands/workflows/contexts/apply'
import {beforeStep, contextId4, integrationId4, orgId4, snykToken, tab} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment create', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const apply = new Contexts([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId4, tab])
        return apply.run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stdout).to.contain(`Applying Context ID ${contextId4} on integrations ${integrationId4}`)
    expect(stdout).to.contain('Contexts Apply Workflow completed.')
  })
})
