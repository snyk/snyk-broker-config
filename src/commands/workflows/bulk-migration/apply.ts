import {ux} from '@oclif/core'
import {printFormattedJSON, STATUS} from '../../../utils/display.js'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {applyBulkMigration} from '../../../api/connections.js'
import {BaseCommand} from '../../../base-command.js'
import {applyBulkMigrationResponse} from '../../../api/types.js'

export default class BulkMigrationApply extends BaseCommand<typeof BulkMigrationApply> {
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Apply Bulk-Migration Workflow'

  static examples = [
    `$ <%= config.bin %> <%= command.id %>`,
    `# The command will then prompt for Tenant, Install, Deployment, and Connection selection.`,
    `# It will then initiate the bulk migration process for the selected connection.`,
  ]

  async run() {
    this.heading(BulkMigrationApply.description)

    const {tenantId, installId} = await this.setupFlow()
    this.logStatus(ux.colorize('cyan', `\nUsing Tenant ID ${tenantId} and Install ID ${installId}.\n`))

    const deploymentId = await this.selectDeployment(tenantId, installId)
    this.logStatus(ux.colorize('cyan', `Using Deployment ID ${deploymentId}.\n`))

    const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
    const connectionId = selectedConnection.id
    this.logStatus(ux.colorize('cyan', `Using Connection ID ${connectionId} (${selectedConnection.name}).\n`))

    this.logStatus(
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

      this.logStatus(ux.colorize('green', `\n${STATUS.OK} Bulk migration process started successfully:`))
      this.log(printFormattedJSON(bulkMigrationResponse.data))
      return bulkMigrationResponse.data
    } catch (error) {
      this.error(`\n${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
