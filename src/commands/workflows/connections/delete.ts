import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {deleteConnectionForDeployment} from '../../../api/connections.js'
import {getIntegrationsForConnection} from '../../../api/integrations.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker -  Delete Connection workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))
      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      const connectionIntegration = await getIntegrationsForConnection(tenantId, selectedConnection.id)
      if (connectionIntegration.data.length > 0) {
        this.error(
          `Please disconnect connection integration(s) first (connection disconnect workflow). Connection is used by org${connectionIntegration.data.length > 1 ? 's' : ''} ${connectionIntegration.data.map((x) => x.org_id).join(',')}.`,
        )
      }
      this.log(ux.colorize('cyan', `Selected connection id ${selectedConnection.id}. Ready to delete connection.\n`))
      if (
        await confirm({
          message: `Are you sure you want to delete connection ${selectedConnection.id} ?`,
        })
      ) {
        this.log(ux.colorize('blue', `Deleting connection ${selectedConnection.id}`))
        await deleteConnectionForDeployment(tenantId, installId, deploymentId, selectedConnection.id)
      } else {
        this.log(ux.colorize('cyan', 'Canceling.'))
      }

      this.log(ux.colorize('red', 'Connection Deletion Workflow completed.'))
    } catch (error: any) {
      if (error.name === 'ExitPromptError') {
        this.log(ux.colorize('red', 'Goodbye.'))
      } else {
        // Handle other errors or rethrow
        throw error
      }
    }
    return JSON.stringify('')
  }
}