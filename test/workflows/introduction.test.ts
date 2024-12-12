import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Intro from '../../src/commands/introduction/index'
import {Config} from '@oclif/core/config'
import {sendScenarioWithOutAutoEnter} from '../test-utils/stdin-utils'

const stdin = fstdin()
const upArrow = '\u001b[A'
const downArrow = '\u001b[B'
describe('documentation', () => {
  it('runs introduction cmd', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const introduction = new Intro([], cfg)
    const {stdout} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [
          '\n',
          downArrow,
          '\n',
          downArrow,
          downArrow,
          '\n',
          downArrow,
          downArrow,
          downArrow,
          '\n',
          upArrow,
          '\n',
        ])
        return introduction.run()
      },
      {print: false},
    )

    expect(stdout).to.contain('Learn more about > connections')
    expect(stdout).to.contain('Learn more about > credentials')
    expect(stdout).to.contain('Learn more about > deployments')
    expect(stdout).to.contain('Goodbye.')
  })
})
