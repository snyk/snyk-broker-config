import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'
import nock from 'nock'

import Connections from '../../../src/commands/workflows/connections/integrate'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('connections integrate workflow - multiple-profile connection type', () => {
  const stdin = fstdin()
  const tenantId = '00000000-0000-0000-0000-0000000000aa'
  const installId = '00000000-0000-0000-0000-0000000000ab'
  const deploymentId = '00000000-0000-0000-0000-0000000000ac'
  const connectionId = '00000000-0000-0000-0000-0000000000bb'
  const orgId = '3a7c1ab9-8914-4f39-a8c0-5752af653a90'
  const integrationId = '3a7c1ab9-8914-4f39-a8c0-5752af653a91'
  const apiPath = `/rest/tenants/${tenantId}/brokers/connections/${connectionId}/orgs/${orgId}/integration`

  const newCommand = () => {
    // @ts-ignore
    const cfg: Config = {}
    const command = new Connections([], cfg)
    // The selection steps are covered by the other integrate tests; stub them so
    // this test controls the connection type.
    command.setupFlow = async () => ({installId, tenantId}) as any
    command.selectDeployment = async () => deploymentId
    command.selectConnection = async () => ({id: connectionId, type: 'ecr', name: 'ecr-conn'})
    return command
  }

  beforeEach(() => {
    process.env.SNYK_TOKEN = 'dummy'
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('prompts for the integration id, re-prompts on blank, and sends it in the body', async () => {
    let capturedBody: unknown
    const scope = nock('https://api.snyk.io')
      .post(apiPath, (body) => {
        capturedBody = body
        return true
      })
      .query(true)
      .reply(201, {
        data: {id: integrationId, integration_type: 'ecr', org_id: orgId, type: 'broker_integration'},
        jsonapi: {version: '1.0'},
        links: {},
      })

    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [orgId, '', integrationId])
        return newCommand().run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stdout + stderr).to.contain('Please enter a valid UUID.')
    expect(capturedBody).to.deep.equal({data: {type: 'ecr', integration_id: integrationId}})
    expect(stderr).to.contain(`integrated with integration ${integrationId} on Org ${orgId}.`)
    scope.done()
  })
})
