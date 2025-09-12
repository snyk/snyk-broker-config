import {captureOutput} from '@oclif/test'
import {expect} from 'chai'
import {stdin as fstdin} from 'mock-stdin'
import nock from 'nock'
import {Config} from '@oclif/core'

import BulkMigrationListCommand from '../../../src/commands/workflows/bulk-migration/list.js'
import {beforeStep, tenantId, snykToken, installId6, deploymentId6, connectionId6} from '../../test-utils/nock-utils.js'
import {sendScenario} from '../../test-utils/stdin-utils.js'

describe('connections bulk-migration list workflow - no orgs', () => {
  const stdin = fstdin()
  const testTenantId = tenantId
  const testInstallId = installId6
  const testDeploymentId = deploymentId6
  const testConnectionId = connectionId6

  before(() => {
    beforeStep()
    process.env.SNYK_TOKEN = snykToken
    process.env.TENANT_ID = testTenantId
    process.env.INSTALL_ID = testInstallId
  })

  after(() => {
    nock.cleanAll()
    stdin.restore()
    delete process.env.SNYK_TOKEN
    delete process.env.TENANT_ID
    delete process.env.INSTALL_ID
  })

  it('runs connections:bulk-migration:list and displays no organizations message', async () => {
    // @ts-ignore
    const cfg: Config = {}

    const command = new BulkMigrationListCommand([], cfg)

    const {stdout, stderr, error} = await captureOutput(async () => {
      sendScenario(stdin, [])
      return command.run()
    })

    expect(error, `Command execution error: ${error?.message}`).to.be.undefined
    expect(stderr, 'Expected stderr to be empty').to.equal('')

    expect(stdout).to.contain('Universal Broker - List Bulk-Migration Workflow')
    expect(stdout).to.contain(
      `Fetching bulk migration orgs for Connection ${testConnectionId}, Deployment ${testDeploymentId}, Tenant ${testTenantId}, Install ${testInstallId}...`,
    )
    expect(stdout).to.contain('No organizations found for bulk migration for the specified connection.')
    expect(stdout).not.to.contain('Organizations available for bulk migration:')
    expect(stdout).not.to.contain('Total organizations found:')
  })
})
