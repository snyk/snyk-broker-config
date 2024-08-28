import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {deleteConnectionForDeployment} from '../../../api/connections.js'
import {getIntegrationsForConnection} from '../../../api/integrations.js'
import {deleteDeployment} from '../../../api/deployments.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker -  Delete Deployment workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow(true)

      this.log(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)

      this.log(ux.colorize('cyan', `Selected deployment id ${deploymentId}. Ready to delete deployment.\n`))
      if (
        await confirm({
          message: `Are you sure you want to delete deployment ${deploymentId} ?`,
        })
      ) {
        this.log(ux.colorize('blue', `Deleting deployment ${deploymentId}`))
        await deleteDeployment(tenantId, installId, deploymentId)
      } else {
        this.log(ux.colorize('cyan', 'Canceling.'))
      }

      this.log(ux.colorize('red', 'Deployment Deletion Workflow completed.'))
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