import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'
import nock from 'nock'
import {Config} from '@oclif/core'

import BulkMigrationApplyCommand from '../../../src/commands/workflows/bulk-migration/apply.js'
import {
  beforeStep,
  tenantId,
  snykToken,
  installId7,
  deploymentId7,
  connectionId7,
  installId8,
  deploymentId8,
  connectionId8,
} from '../../test-utils/nock-utils.js'
import {sendScenario} from '../../test-utils/stdin-utils.js'

describe('connections bulk-migration apply workflow', () => {
  const stdin = fstdin()
  const successTestTenantId = tenantId
  const successTestInstallId = installId7
  const successTestDeploymentId = deploymentId7
  const successTestConnectionId = connectionId7

  const errorTestTenantId = tenantId
  const errorTestInstallId = installId8
  const errorTestDeploymentId = deploymentId8
  const errorTestConnectionId = connectionId8

  beforeEach(() => {
    beforeStep()
    process.env.SNYK_TOKEN = snykToken
  })

  afterEach(() => {
    nock.cleanAll()
    stdin.restore()
    delete process.env.SNYK_TOKEN
    delete process.env.TENANT_ID
    delete process.env.INSTALL_ID
  })

  it('runs connections:bulk-migration:apply and successfully starts migration', async () => {
    process.env.TENANT_ID = successTestTenantId
    process.env.INSTALL_ID = successTestInstallId

    // @ts-ignore
    const cfg: Config = {}
    const command = new BulkMigrationApplyCommand([], cfg)

    // Mock selection methods
    command.selectDeployment = async () => successTestDeploymentId
    command.selectConnection = async () => ({
      id: successTestConnectionId,
      name: 'Mocked Success Connection',
      type: 'generic',
    })

    const {stdout, stderr, error} = await captureOutput(async () => {
      sendScenario(stdin, [])
      return command.run()
    })

    expect(error, `Command execution error: ${error?.message}`).to.be.undefined
    expect(stderr, 'Expected stderr to be empty').to.equal('')

    expect(stdout).to.contain('Universal Broker - Apply Bulk-Migration Workflow')
    expect(stdout).to.contain(
      `Initiating bulk migration for Connection ${successTestConnectionId}, Deployment ${successTestDeploymentId}, Tenant ${successTestTenantId}, Install ${successTestInstallId}...`,
    )
    expect(stdout).to.contain('Bulk migration process started successfully:')
  })

  it('runs connections:bulk-migration:apply and handles API error', async () => {
    process.env.TENANT_ID = errorTestTenantId
    process.env.INSTALL_ID = errorTestInstallId
    const errorMessage = 'Internal Server Error For Test'
    const errorDetail = 'Something went terribly wrong during apply for test.'

    // @ts-ignore
    const cfg: Config = {}
    const command = new BulkMigrationApplyCommand([], cfg)

    command.selectDeployment = async () => errorTestDeploymentId
    command.selectConnection = async () => ({
      id: errorTestConnectionId,
      name: 'Mocked Error Connection',
      type: 'generic',
    })

    const {stdout, stderr, error} = await captureOutput(async () => {
      sendScenario(stdin, [])
      return command.run()
    })

    expect(error, 'Command should have exited with an error').to.not.be.undefined
    // Default exit code for this.error() without explicit code is 2
    expect(error?.oclif?.exit).to.equal(2)

    expect(stdout).to.contain('Universal Broker - Apply Bulk-Migration Workflow')
    expect(stdout).to.contain(
      `Initiating bulk migration for Connection ${errorTestConnectionId}, Deployment ${errorTestDeploymentId}, Tenant ${errorTestTenantId}, Install ${errorTestInstallId}...`,
    )
    expect(stdout).not.to.contain('Bulk migration process started successfully:')
  })
})
