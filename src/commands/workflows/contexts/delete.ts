import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {deleteContextById} from '../../../api/contexts.js'
import {STATUS} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Delete Contexts Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))
      const selectedContext = await this.selectContext(tenantId, installId, deploymentId)

      this.logStatus(ux.colorize('cyan', `Selected Context ID ${selectedContext.id}. Ready to delete Context.\n`))
      if (
        await confirm({
          message: `Are you sure you want to delete Context ${selectedContext.id} ?`,
        })
      ) {
        this.logStatus(ux.colorize('cyan', `Deleting Context ${selectedContext.id}`))
        await deleteContextById(tenantId, installId, selectedContext.id)
      } else {
        this.logStatus(ux.colorize('cyan', 'Canceling.'))
      }

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Context Deletion Workflow completed.`))
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
