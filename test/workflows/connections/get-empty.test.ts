import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/get'
import {beforeStep, orgId2, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('connections workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow connections list - empty', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const getConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId2])

        return getConnection.run()
      },
      {print: false},
    )
    expect(error?.message).to.contain('No Connection found.')
  })
})
