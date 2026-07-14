import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON, STATUS} from '../../../utils/display.js'
import {getContextsForForDeployment} from '../../../api/contexts.js'

export default class ContextsUsage extends BaseCommand<typeof ContextsUsage> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Contexts Usage Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(ContextsUsage.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const selectedContext = await this.selectContext(tenantId, installId, deploymentId)
      this.logStatus(ux.colorize('cyan', `Now using Context ${selectedContext.id}.\n`))

      const contexts = await getContextsForForDeployment(tenantId, installId, deploymentId)
      let usageDetails
      if (contexts.data && contexts.data.length > 0) {
        const context = contexts.data.find((context) => context.id === selectedContext.id)

        this.logStatus(ux.colorize('cyan', 'Organizations (Integrations) using this context:'))
        usageDetails = context?.relationships?.applied_integrations.map((integration) => ({
          'Integration Id': integration.data.id,
          'Organization Id': integration.data.org_id,
        }))
        this.log(printFormattedJSON(usageDetails))
      } else {
        this.logStatus(ux.colorize('cyan', 'No organizations (integrations) are currently using this context.'))
      }

      this.logStatus(ux.colorize('green', `\n${STATUS.DONE} Contexts Usage Workflow completed.`))
      return usageDetails
    } catch (error: any) {
      if (error.name === 'ExitPromptError') {
        this.logStatus('Goodbye.')
      } else {
        throw error
      }
    }
  }
}
