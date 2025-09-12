import {ux} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  commonUniversalBrokerConnectionId,
  getCommonIds,
} from '../../common/args.js'
import {applyBulkMigration} from '../../api/connections.js'
import {BaseCommand} from '../../base-command.js'
import {applyBulkMigrationResponse} from '../../api/types.js' // Renamed

export default class BulkMigrationApply extends BaseCommand<typeof BulkMigrationApply> {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonUniversalBrokerConnectionId(true),
    ...commonApiRelatedArgs,
  }

  static description =
    'Initiate bulk migration for integrations from legacy to universal broker for a specific connection.'

  static examples = [
    `# With TENANT_ID and INSTALL_ID exported as environment variables:`,
    `$ <%= config.bin %> <%= command.id %> DEPLOYMENT_ID CONNECTION_ID`,
    `\n# With TENANT_ID and INSTALL_ID provided as arguments:`,
    `$ <%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID CONNECTION_ID`,
  ]

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', BulkMigrationApply.description))
    const {args} = await this.parse(BulkMigrationApply)
    const {tenantId, installId} = getCommonIds(args)

    if (!tenantId) {
      this.error('Tenant ID must be provided either as an argument or as a TENANT_ID environment variable.', {exit: 1})
    }
    if (!installId) {
      this.error('Install ID must be provided either as an argument or as an INSTALL_ID environment variable.', {
        exit: 1,
      })
    }

    const deploymentId = args.deploymentId!
    const connectionId = args.connectionId!

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
      this.error(ux.colorize('red', `\nFailed to start bulk migration: ${(error as Error).message}`), {exit: 1})
    }
  }
}
