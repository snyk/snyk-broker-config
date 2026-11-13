import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'
import nock from 'nock'

import Migrate from '../../../src/commands/workflows/connections/migrate'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('connections migrate workflow - integration id', () => {
  const stdin = fstdin()
  const tenantId = '00000000-0000-0000-0000-0000000000aa'
  const installId = '00000000-0000-0000-0000-0000000000ab'
  const deploymentId = '00000000-0000-0000-0000-0000000000ac'
  const connectionId = '00000000-0000-0000-0000-0000000000bb'
  const orgId = '3a7c1ab9-8914-4f39-a8c0-5752af653a90'
  const integrationId = '3a7c1ab9-8914-4f39-a8c0-5752af653a91'
  const apiPath = `/rest/tenants/${tenantId}/brokers/connections/${connectionId}/orgs/${orgId}/integration`

  const newCommand = (type: string) => {
    // @ts-ignore
    const cfg: Config = {}
    const command = new Migrate([], cfg)
    // Selection steps are shared with the other workflows; stub them so the
    // test controls the connection type.
    command.setupFlow = async () => ({installId, tenantId}) as any
    command.selectDeployment = async () => deploymentId
    command.selectConnection = async () => ({id: connectionId, type, name: `${type}-conn`})
    return command
  }

  const captureBody = (type: string) => {
    const captured: {body?: unknown} = {}
    const scope = nock('https://api.snyk.io')
      .post(apiPath, (body) => {
        captured.body = body
        return true
      })
      .query(true)
      .reply(201, {
        data: {id: integrationId, integration_type: type, org_id: orgId, type: 'broker_integration'},
        jsonapi: {version: '1.0'},
        links: {},
      })
    return {captured, scope}
  }

  beforeEach(() => {
    process.env.SNYK_TOKEN = 'dummy'
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('requires and sends the integration id for a multiple-profile type, naming it in the confirm', async () => {
    const {captured, scope} = captureBody('ecr')

    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [orgId, '', integrationId, 'y'])
        return newCommand('ecr').run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stdout + stderr).to.contain('Please enter a valid UUID.')
    // Long prompts are wrapped to the terminal width; compare the flattened text.
    // eslint-disable-next-line no-control-regex
    const flattened = (stdout + stderr).replaceAll(/\u001B\[[\d;]*[A-Za-z]/g, '').replaceAll(/\s+/g, ' ')
    expect(flattened).to.contain(`migrate the integration ${integrationId} (type ecr) in org ${orgId}`)
    expect(captured.body).to.deep.equal({data: {type: 'ecr', integration_id: integrationId}})
    expect(stderr).to.contain('Connection Migrate Workflow completed.')
    scope.done()
  })

  it('does not ask for an integration id for a single-profile type', async () => {
    const {captured, scope} = captureBody('github')

    const {stdout, stderr, error} = await captureOutput(
      async () => {
        sendScenario(stdin, [orgId, 'y'])
        return newCommand('github').run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stdout + stderr).to.not.contain('Integration (profile)')
    expect(captured.body).to.deep.equal({data: {type: 'github'}})
    expect(stderr).to.contain('Connection Migrate Workflow completed.')
    scope.done()
  })
})
