import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Integrations from '../../../src/commands/workflows/integrations/get'
import {beforeStep, downArrow, orgId4, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('integrations workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow connection integrations list', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const getIntegrations = new Integrations([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId4, downArrow])

        return getIntegrations.run()
      },
      {print: false},
    )
    expect(error).to.be.undefined
    expect(stdout).to.contain(`
      - id: ${orgId4}
        integration_type: string
        org_id: ${orgId4}
        type: github
`)
    expect(stdout).to.contain('Connection Integration listing Workflow completed.')
  })
})
