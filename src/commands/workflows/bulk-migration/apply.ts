import {ux} from '@oclif/core'
import {printFormattedJSON} from '../../../utils/display.js'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {applyBulkMigration} from '../../../api/connections.js'
import {BaseCommand} from '../../../base-command.js'
import {applyBulkMigrationResponse} from '../../../api/types.js'

export default class BulkMigrationApply extends BaseCommand<typeof BulkMigrationApply> {
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Bulk-Migration - Apply operation'

  static examples = [
    `$ <%= config.bin %> <%= command.id %>`,
    `# The command will then prompt for Tenant, Install, Deployment, and Connection selection.`,
    `# It will then initiate the bulk migration process for the selected connection.`,
  ]

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', BulkMigrationApply.description))

    const {tenantId, installId, appInstalledOnOrgId} = await this.setupFlow()
    this.log(ux.colorize('cyan', `\nUsing Tenant ID ${tenantId} and Install ID ${installId}.\n`))

    const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
    this.log(ux.colorize('cyan', `Using Deployment ID ${deploymentId}.\n`))

    const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
    const connectionId = selectedConnection.id
    this.log(ux.colorize('cyan', `Using Connection ID ${connectionId} (${selectedConnection.name}).\n`))

    this.log(
      ux.colorize(
        'cyan',
        `Initiating bulk migration for Connection ${connectionId}, Deployment ${deploymentId}, Tenant ${tenantId}, Install ${installId}...`,
      ),
    )

    try {
      const bulkMigrationResponse: applyBulkMigrationResponse = await applyBulkMigration(
        tenantId,
        installId,
        deploymentId,
        connectionId,
      )

      this.log(ux.colorize('green', '\nBulk migration process started successfully:'))
      this.log(printFormattedJSON(bulkMigrationResponse.data))
      return JSON.stringify(bulkMigrationResponse.data)
    } catch (error) {
      this.error(ux.colorize('red', `\nFailed to start bulk migration: ${(error as Error).message}`))
    }
  }
}
