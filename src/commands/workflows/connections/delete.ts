import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {deleteConnectionForDeployment} from '../../../api/connections.js'
import {deleteIntegrationsForConnection, getIntegrationsForConnection} from '../../../api/integrations.js'
import {STATUS} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Delete Connection Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))
      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      const connectionIntegration = await getIntegrationsForConnection(tenantId, selectedConnection.id)
      if (connectionIntegration.data.length > 0) {
        if (
          (await confirm({
            message: `Connection ${selectedConnection.id} is used by ${connectionIntegration.data.length} orgs/integrations. Do you want to disconnect them all?`,
          })) &&
          (await confirm({
            message: `Are you sure? Please confirm. Disconnecting integration(s) WILL impact service.`,
          }))
        ) {
          for (let i = 0; i < connectionIntegration.data.length; i++) {
            this.logStatus(
              `Disconnecting integration ${connectionIntegration.data[i].id} in org ${connectionIntegration.data[i].org_id}`,
            )
            await deleteIntegrationsForConnection(
              tenantId,
              selectedConnection.id,
              connectionIntegration.data[i].org_id,
              connectionIntegration.data[i].id,
            )
          }
          this.logStatus(ux.colorize('green', `${STATUS.DONE} Disconnected.`))
        } else {
          this.error(
            `Please disconnect Connection integration(s) first (connection disconnect workflow). Connection is used by Org${connectionIntegration.data.length > 1 ? 's' : ''} ${connectionIntegration.data.map((x) => x.org_id).join(',')}.`,
          )
        }
      }
      this.logStatus(
        ux.colorize('cyan', `Selected Connection ID ${selectedConnection.id}. Ready to delete Connection.\n`),
      )
      if (
        await confirm({
          message: `Are you sure you want to delete Connection ${selectedConnection.id} ?`,
        })
      ) {
        this.logStatus(ux.colorize('cyan', `Deleting Connection ${selectedConnection.id}`))
        await deleteConnectionForDeployment(tenantId, installId, deploymentId, selectedConnection.id)
      } else {
        this.logStatus(ux.colorize('cyan', 'Canceling.'))
      }

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Connection Deletion Workflow completed.`))
    } catch (error: any) {
      if (error.name === 'ExitPromptError') {
        this.logStatus('Goodbye.')
      } else {
        // Handle other errors or rethrow
        throw error
      }
    }
  }
}
