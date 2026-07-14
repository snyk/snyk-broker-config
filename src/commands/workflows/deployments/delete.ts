import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {getConnectionsForDeployment} from '../../../api/connections.js'
import {deleteDeployment} from '../../../api/deployments.js'
import {getCredentialsForDeployment} from '../../../api/credentials.js'
import {STATUS} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Delete Deployment workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId} = await this.setupFlow(true)

      this.logStatus(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      const connectionsForDeployment = await getConnectionsForDeployment(tenantId, installId, deploymentId)
      if (connectionsForDeployment.data.length > 0) {
        this.error('You cannot delete deployments supporting connections. Disconnect and delete connections first.')
      }
      const credentialsRefsForDeployment = await getCredentialsForDeployment(tenantId, installId, deploymentId)
      if (credentialsRefsForDeployment.data.length > 0) {
        this.error(
          'You cannot delete deployments with associated credentials references. Delete the credentials reference(s) first.',
        )
      }
      this.logStatus(ux.colorize('cyan', `Selected deployment id ${deploymentId}. Ready to delete deployment.\n`))
      if (
        await confirm({
          message: `Are you sure you want to delete deployment ${deploymentId} ?`,
        })
      ) {
        this.logStatus(ux.colorize('cyan', `Deleting deployment ${deploymentId}`))
        await deleteDeployment(tenantId, installId, deploymentId)
      } else {
        this.logStatus(ux.colorize('cyan', 'Canceling.'))
      }

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Deployment Deletion Workflow completed.`))
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
