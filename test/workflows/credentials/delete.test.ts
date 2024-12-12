import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Credentials from '../../../src/commands/workflows/credentials/delete'
import {beforeStep, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'
const stdin = fstdin()

describe('deployment workflows', () => {
  before(beforeStep)

  it('runs workflow deployment delete', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const deleteCredentials = new Credentials([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId, 'y', 'y'])

        return deleteCredentials.run()
      },
      {print: false},
    )
    expect(stderr).to.contain('')
    expect(error).to.be.undefined
    expect(stdout).to.contain('Credentials Deletion Workflow completed.')
  })
})
