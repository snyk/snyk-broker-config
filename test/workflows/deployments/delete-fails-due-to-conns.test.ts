import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Deployments from '../../../src/commands/workflows/deployments/delete'
import {beforeStep, downArrow, snykToken} from '../../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../../test-utils/stdin-utils'

describe('deployment workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow deployment delete - fails if conns exist', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const deleteDeployment = new Deployments([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [snykToken, '\n', downArrow, downArrow, downArrow, '\n'])

        return deleteDeployment.run()
      },
      {print: false},
    )
    expect(stderr).to.contain('')
    expect(error?.message).to.contain(
      'You cannot delete deployments supporting connections. Disconnect and delete connections first.',
    )
  })
})
