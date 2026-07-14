import {ux} from '@oclif/core'
import {printFormattedJSON} from '../../../utils/display.js'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {getBulkMigrationOrgs} from '../../../api/connections.js'
import {BaseCommand} from '../../../base-command.js'
import {OrgResource} from '../../../api/types.js'

export default class BulkMigrationList extends BaseCommand<typeof BulkMigrationList> {
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - List Bulk-Migration Workflow'

  static examples = [
    `$ <%= config.bin %> <%= command.id %>`,
    `# The command will then prompt for Tenant, Install, Deployment, and Connection selection.`,
  ]

  async run() {
    this.heading(BulkMigrationList.description)

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
        `Fetching bulk migration orgs for Connection ${connectionId}, Deployment ${deploymentId}, Tenant ${tenantId}, Install ${installId}...`,
      ),
    )

    const orgsListResponse = await getBulkMigrationOrgs(tenantId, installId, deploymentId, connectionId)

    const orgsList: OrgResource[] = orgsListResponse.data

    if (orgsList && orgsList.length > 0) {
      this.logStatus('Organizations available for bulk migration:')
      for (const org of orgsList) {
        this.log(printFormattedJSON(org))
      }
      this.logStatus(`Total organizations found: ${orgsList.length}`)
    } else {
      this.logStatus('No organizations found for bulk migration for the specified connection.')
    }

    return orgsList || []
  }
}
