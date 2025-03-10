import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/delete'
import {beforeStep, downArrow, orgId4, snykToken} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment delete fail due to integrations', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const deleteConnection = new Connections([], cfg)
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
          'n',
          '\n',
        ])
        return deleteConnection.run()
      },
      {print: false},
    )
    expect(error?.message).to.contain(
      `Please disconnect Connection integration(s) first (connection disconnect workflow). Connection is used by Org  ${orgId4}.`,
    )
  })
})
