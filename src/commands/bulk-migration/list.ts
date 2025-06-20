import {ux} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  commonUniversalBrokerConnectionId,
  getCommonIds,
} from '../../common/args.js'
import {getBulkMigrationOrgs} from '../../api/connections.js'
import {BaseCommand} from '../../base-command.js'
import {OrgResource} from '../../api/types.js'

export default class BulkMigrationList extends BaseCommand<typeof BulkMigrationList> {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonUniversalBrokerConnectionId(true),
    ...commonApiRelatedArgs,
  }

  static description = 'List organizations eligible for bulk migration for a specific connection.'

  static examples = [
    `# With TENANT_ID and INSTALL_ID exported as environment variables:`,
    `$ <%= config.bin %> <%= command.id %> DEPLOYMENT_ID CONNECTION_ID`,
    `\n# With TENANT_ID and INSTALL_ID provided as arguments:`,
    `$ <%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID CONNECTION_ID`,
  ]

  async run(): Promise<string> {
    this.log('\\n' + ux.colorize('red', BulkMigrationList.description))
    const {args} = await this.parse(BulkMigrationList)
    const ids = getCommonIds(args)
    const tenantId = ids.tenantId
    const installId = ids.installId

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
        `Fetching bulk migration orgs for Connection ${connectionId}, Deployment ${deploymentId}, Tenant ${tenantId}, Install ${installId}...`,
      ),
    )

    const orgsListResponse = await getBulkMigrationOrgs(tenantId, installId, deploymentId, connectionId)

    const orgsList: OrgResource[] = orgsListResponse.data

    if (orgsList && orgsList.length > 0) {
      this.log('Organizations available for bulk migration:')
      for (const org of orgsList) {
        this.log(printFormattedJSON(org))
      }
      this.log(`Total organizations found: ${orgsList.length}`)
    } else {
      this.log('No organizations found for bulk migration for the specified connection.')
    }

    return JSON.stringify(orgsList || [])
  }
}
