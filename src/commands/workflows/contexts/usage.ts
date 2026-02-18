import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON} from '../../../utils/display.js'
import {getContextsForForDeployment} from '../../../api/contexts.js'

export default class ContextsUsage extends BaseCommand<typeof ContextsUsage> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Contexts Usage Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', ContextsUsage.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const selectedContext = await this.selectContext(tenantId, installId, deploymentId)
      this.log(ux.colorize('cyan', `Now using Context ${selectedContext.id}.\n`))

      const contexts = await getContextsForForDeployment(tenantId, installId, deploymentId)
      let usageDetails
      if (contexts.data && contexts.data.length > 0) {
        const context = contexts.data.find((context) => context.id === selectedContext.id)

        this.log(ux.colorize('green', 'Organizations (Integrations) using this context:'))
        usageDetails = context?.relationships?.applied_integrations.map((integration) => ({
          'Integration Id': integration.data.id,
          'Organization Id': integration.data.org_id,
        }))
        this.log(printFormattedJSON(usageDetails))
      } else {
        this.log(ux.colorize('yellow', 'No organizations (integrations) are currently using this context.'))
      }

      this.log(ux.colorize('red', '\nContexts Usage Workflow completed.'))
      return JSON.stringify(usageDetails)
    } catch (error: any) {
      if (error.name === 'ExitPromptError') {
        this.log(ux.colorize('red', 'Goodbye.'))
      } else {
        throw error
      }
    }
    return JSON.stringify('')
  }
}
