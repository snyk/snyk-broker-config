import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON} from '../../../utils/display.js'
import {getDeployments} from '../../../api/deployments.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Get Deployments Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId} = await this.setupFlow(true)

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deployments = await getDeployments(tenantId, installId)
      if (deployments.data && deployments.data?.length > 0) {
        this.log(printFormattedJSON(deployments.data))
      } else {
        this.log(ux.colorize('cyan', `No deployment found.\n`))
      }

      this.log(ux.colorize('red', 'Get Deployments Workflow completed.'))
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
