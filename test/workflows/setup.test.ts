import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'
import nock from 'nock'

import Setup from '../../src/commands/workflows/setup'
import {
  beforeStep,
  clientId,
  deploymentId,
  downArrow,
  integrationId3,
  orgId,
  orgId3,
  replacedClientSecret,
  snykToken,
} from '../test-utils/nock-utils'
import {sendScenarioWithOutAutoEnter} from '../test-utils/stdin-utils'

describe('setup workflow', () => {
  let stdin: ReturnType<typeof fstdin>

  beforeEach(() => {
    stdin = fstdin()
    beforeStep()
  })

  afterEach(() => {
    nock.cleanAll()
    stdin.restore()
    delete process.env.SNYK_TOKEN
    delete process.env.TENANT_ID
  })

  it('runs guided setup: deployment + one connection, integration skipped', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const setup = new Setup([], cfg)
    const {stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [
          snykToken,
          '\n',
          orgId, // discovery: enter Org ID -> API finds existing install -> client_id surfaced
          '\n',
          'n', // "Need a new client secret?" -> no
          '\n',
          'y', // "Create a Connection now?" -> yes
          '\n',
          downArrow,
          downArrow,
          downArrow,
          '\n',
          'test-conn',
          '\n',
          'http://broker.client.url/',
          '\n',
          'http://artifactory.hostname/',
          '\n',
          'artifactory-crbase.hostname',
          '\n',
          'username',
          '\n',
          '\n',
          'ARTIFACTORY_PASSWORD',
          '\n',
          'dummy comment',
          '\n',
          'n', // "Integrate this Connection with an Org now?" -> no
          '\n',
          'n', // "Add another Connection?" -> no
          '\n',
        ])
        return setup.run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stderr).to.contain('Universal broker provisioned.')
    expect(stderr).to.contain(`export DEPLOYMENT_ID=${deploymentId}`)
    expect(stderr).to.contain(`export CLIENT_ID=${clientId}`)
  })

  it('prompts for and submits an integration id for a container registry connection', async () => {
    let integrationRequestBody: unknown
    const integrationScope = nock('https://api.snyk.io')
      .post(
        `/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/connections/00000000-0000-0000-0000-000000000000/orgs/${orgId3}/integration`,
        (body) => {
          integrationRequestBody = body
          return true
        },
      )
      .query({version: '2024-10-15'})
      .reply(201, {
        data: {
          id: integrationId3,
          integration_type: 'artifactory-cr',
          org_id: orgId3,
          type: 'broker_integration',
        },
        jsonapi: {version: '1.0'},
        links: {},
      })

    // @ts-ignore
    const cfg: Config = {}
    const setup = new Setup([], cfg)
    const {stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [
          snykToken,
          '\n',
          orgId,
          '\n',
          'n', // "Need a new client secret?" -> no
          '\n',
          'y', // "Create a Connection now?" -> yes
          '\n',
          downArrow,
          downArrow,
          downArrow,
          '\n',
          'test-conn',
          '\n',
          'http://broker.client.url/',
          '\n',
          'http://artifactory.hostname/',
          '\n',
          'artifactory-crbase.hostname',
          '\n',
          'username',
          '\n',
          '\n',
          'ARTIFACTORY_PASSWORD',
          '\n',
          'dummy comment',
          '\n',
          'y', // "Integrate this Connection with an Org now?" -> yes
          '\n',
          orgId3,
          '\n',
          integrationId3,
          '\n',
          'n', // "Integrate with another Org?" -> no
          '\n',
          'n', // "Add another Connection?" -> no
          '\n',
        ])
        return setup.run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stderr).to.contain(`integrated with integration ${integrationId3}`)
    expect(integrationRequestBody).to.deep.equal({
      data: {type: 'artifactory-cr', integration_id: integrationId3},
    })
    integrationScope.done()
  })

  it('regenerates the client secret on resume and shows it in the closing block', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const setup = new Setup([], cfg)
    const {stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [
          snykToken,
          '\n',
          orgId, // existing install -> client_id surfaced, no fresh secret
          '\n',
          'y', // "Need a new client secret?" -> yes, rotate
          '\n',
          'y', // "Have you saved the client secret?" -> yes
          '\n',
          'y', // "Create a Connection now?" -> yes
          '\n',
          downArrow,
          downArrow,
          downArrow,
          '\n',
          'test-conn',
          '\n',
          'http://broker.client.url/',
          '\n',
          'http://artifactory.hostname/',
          '\n',
          'artifactory-crbase.hostname',
          '\n',
          'username',
          '\n',
          '\n',
          'ARTIFACTORY_PASSWORD',
          '\n',
          'dummy comment',
          '\n',
          'n', // "Integrate this Connection with an Org now?" -> no
          '\n',
          'n', // "Add another Connection?" -> no
          '\n',
        ])
        return setup.run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stderr).to.contain('Universal broker provisioned.')
    expect(stderr).to.contain(`export CLIENT_ID=${clientId}`)
    expect(stderr).to.contain(`export CLIENT_SECRET=${replacedClientSecret}`)
  })

  it('lets the user skip connection creation entirely', async () => {
    // @ts-ignore
    const cfg: Config = {}
    const setup = new Setup([], cfg)
    const {stderr, error} = await captureOutput(
      async () => {
        sendScenarioWithOutAutoEnter(stdin, [
          snykToken,
          '\n',
          orgId, // existing install -> client_id surfaced, no fresh secret
          '\n',
          'n', // "Need a new client secret?" -> no
          '\n',
          'n', // "Create a Connection now?" -> no, skip entirely
          '\n',
        ])
        return setup.run()
      },
      {print: false},
    )

    expect(error).to.be.undefined
    expect(stderr).to.contain('Universal broker provisioned.')
    expect(stderr).to.contain('No Connections created this session')
    expect(stderr).to.contain(`export DEPLOYMENT_ID=${deploymentId}`)
  })
})
