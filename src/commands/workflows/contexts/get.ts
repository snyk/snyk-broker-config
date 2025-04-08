import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON} from '../../../utils/display.js'
import {getConnectionsForDeployment} from '../../../api/connections.js'
import {getContextForForDeployment} from '../../../api/contexts.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Get Contexts Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const selectedContext = await this.selectContext(tenantId, installId, deploymentId)

      this.log(printFormattedJSON(selectedContext))
      this.log(ux.colorize('red', 'Contexts Get Workflow completed.'))
      return JSON.stringify(this.selectContext)
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
