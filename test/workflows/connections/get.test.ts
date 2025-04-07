import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'

import Connections from '../../../src/commands/workflows/connections/get'
import {beforeStep, orgId3, snykToken} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('connections workflows', () => {
  const stdin = fstdin()
  before(beforeStep)

  it('runs workflow connections list', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const getConnection = new Connections([], cfg)
    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [snykToken, 'n', orgId3])

        return getConnection.run()
      },
      {print: true},
    )

    expect(error).to.be.undefined
    expect(stdout.replaceAll(' ','')).to.contain(`- id: 00000000-0000-0000-0000-000000000003
    attributes:
        deployment_id: 00000000-0000-0000-0000-000000000000
        identifier: 00000000-0000-0000-0000-000000000000
        name: test-conn
        secrets:
            primary:
                encrypted:
                expires_at: 1970-01-01T00:00:00.000Z
                nonce:

            secondary:
                encrypted:
                expires_at: 1970-01-01T00:00:00.000Z
                nonce:


        configuration:
            required:
                key: value

            type: github
            validations:
                0:
                    key: value




    type: broker_connection
`.replaceAll(' ',''))
    expect(stdout).to.contain('Connection Detail Workflow completed.')
  })
})
