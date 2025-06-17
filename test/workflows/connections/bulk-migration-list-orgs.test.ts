import { captureOutput } from '@oclif/test'
import { expect } from 'chai'
import { stdin as fstdin } from 'mock-stdin'
import nock from 'nock'
import { Config } from '@oclif/core'

import BulkMigrationListCommand from '../../../src/commands/workflows/bulk-migration/list.js'
import {
  beforeStep,
  tenantId,
  snykToken,
  installId5,
  deploymentId5,
  connectionId5
} from '../../test-utils/nock-utils.js'
import { GetOrgsForBulkMigrationResponse } from '../../../src/api/types.js'
import { sendScenario } from '../../test-utils/stdin-utils.js'

describe('connections bulk-migration list workflow - with orgs', () => {
  const stdin = fstdin()
  const testTenantId = tenantId
  const testInstallId = installId5
  const testDeploymentId = deploymentId5
  const testConnectionId = connectionId5


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

  it('runs connections:bulk-migration:list and displays organizations', async () => {
    // @ts-ignore
    const cfg: Config = {}

    const command = new BulkMigrationListCommand([], cfg)

    const { stdout, stderr, error } = await captureOutput(
      async () => {
        sendScenario(stdin, [])
        return command.run()
      },
    )

    expect(error, `Command execution error: ${error?.message}`).to.be.undefined
    expect(stderr, 'Expected stderr to be empty').to.equal('')

    expect(stdout).to.contain('Universal Broker Bulk-Migration - List operation')
    expect(stdout).to.contain(`Fetching bulk migration orgs for Connection ${testConnectionId}, Deployment ${testDeploymentId}, Tenant ${testTenantId}, Install ${testInstallId}...`)
    expect(stdout).to.contain('Organizations available for bulk migration:')
    expect(stdout).to.match(/id: org-uuid-returned-1/)
    expect(stdout).to.match(/type: org_id/)
    expect(stdout).to.match(/id: org-uuid-returned-2/)
    expect(stdout).to.contain(`Total organizations found: 2`)
  })
})
