import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'
import nock from 'nock'
import {Config} from '@oclif/core'

import Deployments from '../../../src/commands/workflows/deployments/create'
import {
  beforeStep,
  discoverTenantId,
  downArrow,
  installId,
  installId2,
  multiDiscoverTenantId,
  orgId,
  orgId2,
  snykToken,
} from '../../test-utils/nock-utils'
import {sendScenario} from '../../test-utils/stdin-utils'

describe('deployment create workflow - tenant install discovery', () => {
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

  it('uses the discovered install without prompting for an Org ID', async () => {
    process.env.TENANT_ID = discoverTenantId
    // @ts-ignore
    const cfg: Config = {}
    const command = new Deployments([], cfg)

    const {stdout, stderr, error} = await captureOutput(async () => {
      // token, then '' selects the first (and only) discovered install, 'n' declines metadata
      sendScenario(stdin, [snykToken, '', 'n'])
      return command.run()
    })

    expect(error).to.be.undefined
    expect(stderr).to.contain(`Found existing Broker App Install ${installId}`)
    expect(stderr).not.to.contain('Enter Org ID')
    expect(stdout).to.contain(`install_id: ${installId}`)
    expect(stdout).to.contain(`broker_app_installed_in_org_id: ${orgId}`)
    expect(stderr).to.contain('Deployment Create Workflow completed.')
  })

  it('selects among multiple discovered installs', async () => {
    process.env.TENANT_ID = multiDiscoverTenantId
    // @ts-ignore
    const cfg: Config = {}
    const command = new Deployments([], cfg)

    const {stdout, stderr, error} = await captureOutput(async () => {
      // token, then downArrow moves to the second discovered install, 'n' declines metadata
      sendScenario(stdin, [snykToken, downArrow, 'n'])
      return command.run()
    })

    expect(error).to.be.undefined
    expect(stderr).to.contain(`Found existing Broker App Install ${installId2}`)
    expect(stderr).not.to.contain('Enter Org ID')
    expect(stdout).to.contain(`install_id: ${installId2}`)
    expect(stdout).to.contain(`broker_app_installed_in_org_id: ${orgId2}`)
    expect(stderr).to.contain('Deployment Create Workflow completed.')
  })

  it('falls back to the Org ID prompt via the escape hatch', async () => {
    process.env.TENANT_ID = discoverTenantId
    // @ts-ignore
    const cfg: Config = {}
    const command = new Deployments([], cfg)

    const {stdout, stderr, error} = await captureOutput(async () => {
      // token, then downArrow selects "Install the Broker App on a different Org", enter the org, decline metadata
      sendScenario(stdin, [snykToken, downArrow, orgId, 'n'])
      return command.run()
    })

    expect(error).to.be.undefined
    // Escape hatch was taken: discovery was NOT used, the org-install path was.
    expect(stderr).not.to.contain('Found existing Broker App Install')
    expect(stderr).to.contain('Found an App already installed')
    expect(stdout).to.contain(`install_id: ${installId}`)
    expect(stderr).to.contain('Deployment Create Workflow completed.')
  })
})
