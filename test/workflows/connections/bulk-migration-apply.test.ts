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
  installId4,
  deploymentId4,
  connectionId4,
} from '../../test-utils/nock-utils.js'
import {applyBulkMigrationResponse} from '../../../src/api/types.js'
import {sendScenario} from '../../test-utils/stdin-utils.js'

describe('connections bulk-migration apply workflow', () => {
  const stdin = fstdin()
  const testTenantId = tenantId
  const testInstallId = installId4
  const testDeploymentId = deploymentId4
  const testConnectionId = connectionId4
  const testApiHostname = 'https://api.snyk.io'
  const testApiVersion = '2024-10-15'

  const mockSuccessResponse: applyBulkMigrationResponse = {
    data: {
      id: 'migration-uuid-123',
      type: 'broker_migration',
      attributes: {
        status: 'pending',
      },
    },
    jsonapi: {version: '1.0'},
    links: {self: `/self/link`},
  }

  beforeEach(() => {
    beforeStep()
    process.env.SNYK_TOKEN = snykToken
    process.env.TENANT_ID = testTenantId
    process.env.INSTALL_ID = testInstallId
  })

  afterEach(() => {
    nock.cleanAll()
    stdin.restore()
    delete process.env.SNYK_TOKEN
    delete process.env.TENANT_ID
    delete process.env.INSTALL_ID
  })

  it('runs connections:bulk-migration:apply and successfully starts migration', async () => {
    nock(testApiHostname)
      .post(
        `/rest/tenants/${testTenantId}/brokers/installs/${testInstallId}/deployments/${testDeploymentId}/connections/${testConnectionId}/bulk_migration?version=${testApiVersion}`,
      )
      .reply(201, mockSuccessResponse)

    // @ts-ignore
    const cfg: Config = {}
    const command = new BulkMigrationApplyCommand([], cfg)

    const {stdout, stderr, error} = await captureOutput(async () => {
      sendScenario(stdin, [])
      return command.run()
    })

    expect(error, `Command execution error: ${error?.message}`).to.be.undefined
    expect(stderr, 'Expected stderr to be empty').to.equal('')

    expect(stdout).to.contain('Universal Broker Bulk-Migration - Apply operation')
    expect(stdout).to.contain(
      `Initiating bulk migration for Connection ${testConnectionId}, Deployment ${testDeploymentId}, Tenant ${testTenantId}, Install ${testInstallId}...`,
    )
    expect(stdout).to.contain('Bulk migration process started successfully:')
    expect(stdout).to.contain(`id: migration-uuid-123`)
    expect(stdout).to.contain(`type: broker_migration`)
    expect(stdout).to.contain(`status: pending`)

    expect(nock.isDone(), 'All nock interceptors should have been called').to.be.true
  })

  it('runs connections:bulk-migration:apply and handles API error', async () => {
    const errorMessage = 'Internal Server Error'
    const errorDetail = 'Something went terribly wrong.'
    nock(testApiHostname)
      .post(
        `/rest/tenants/${testTenantId}/brokers/installs/${testInstallId}/deployments/${testDeploymentId}/connections/${testConnectionId}/bulk_migration?version=${testApiVersion}`,
      )
      .reply(500, {
        errors: [
          {
            status: '500',
            title: errorMessage,
            detail: errorDetail,
          },
        ],
      })

    // @ts-ignore
    const cfg: Config = {}
    const command = new BulkMigrationApplyCommand([], cfg)

    const {stdout, stderr, error} = await captureOutput(async () => {
      sendScenario(stdin, [])
      return command.run()
    })

    expect(error, 'Command should have exited with an error').to.not.be.undefined
    // Default exit code for this.error() without explicit code is 2
    expect(error?.oclif?.exit).to.equal(2)

    expect(stdout).to.contain('Universal Broker Bulk-Migration - Apply operation')
    expect(stdout).to.contain(
      `Initiating bulk migration for Connection ${testConnectionId}, Deployment ${testDeploymentId}, Tenant ${testTenantId}, Install ${testInstallId}...`,
    )
    expect(stdout).not.to.contain('Bulk migration process started successfully:')

    const expectedApiErrorMessage = `API Error: 500 - 500 - ${errorMessage}: ${errorDetail}`
    expect(stderr).to.contain(`Failed to start bulk migration: ${expectedApiErrorMessage}`)

  })
})
