import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Deployments from '../../../src/commands/workflows/deployments/delete'
import {beforeStep, orgId, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'
const stdin = fstdin()

describe('deployment workflows', () => {
  before(beforeStep)

  it('runs workflow deployment delete - fails if creds exist', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const deleteDeployment = new Deployments([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId, 'y'])

        return deleteDeployment.run()
      },
      {print: false},
    )
    expect(stderr).to.contain('')
    expect(error?.message).to.contain(
      'You cannot delete deployments with associated credentials references. Delete the credentials reference(s) first.',
    )
  })
})
