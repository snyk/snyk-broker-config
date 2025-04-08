import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {deleteConnectionForDeployment} from '../../../api/connections.js'
import {deleteIntegrationsForConnection, getIntegrationsForConnection} from '../../../api/integrations.js'
import {deleteContextById, getContextForForDeployment} from '../../../api/contexts.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker -  Delete Contexts Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))
      const selectedContext = await this.selectContext(tenantId, installId, deploymentId)

      this.log(ux.colorize('cyan', `Selected Context ID ${selectedContext.id}. Ready to delete Context.\n`))
      if (
        await confirm({
          message: `Are you sure you want to delete Context ${selectedContext.id} ?`,
        })
      ) {
        this.log(ux.colorize('blueBright', `Deleting Context ${selectedContext.id}`))
        await deleteContextById(tenantId, installId, selectedContext.id)
      } else {
        this.log(ux.colorize('cyan', 'Canceling.'))
      }

      this.log(ux.colorize('red', 'Context Deletion Workflow completed.'))
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
