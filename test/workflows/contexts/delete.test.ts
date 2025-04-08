import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Contexts from '../../../src/commands/workflows/contexts/delete'
import {beforeStep, connectionId3, orgId3, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment delete', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const deleteConnection = new Contexts([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId3, 'y'])

        return deleteConnection.run()
      },
      {print: false},
    )
    expect(stderr).to.contain('')
    expect(error).to.be.undefined
    expect(stdout).to.contain(`Deleting Context ${connectionId3}`)
    expect(stdout).to.contain('Context Deletion Workflow completed.')
  })
})
