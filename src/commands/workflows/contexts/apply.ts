import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON} from '../../../utils/display.js'
import {getIntegrationsForConnection} from '../../../api/integrations.js'
import * as multiSelect from 'inquirer-select-pro'
import {applyContext} from '../../../api/contexts.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Apply Contexts Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const selectedContext = await this.selectContext(tenantId, installId, deploymentId)

      this.log(
        ux.colorize(
          'cyan',
          `Selected Context ID ${selectedContext.id}. Ready to select integrations to use this Context on.\n`,
        ),
      )

      const integrationsForConnectionId = await getIntegrationsForConnection(tenantId, selectedContext.connectionId)
      const choices = integrationsForConnectionId.data.map((x) => {
        return {name: `[Type: ${x.integration_type}] in org ${x.org_id} (integration ${x.id})`, value: x.id}
      })
      if (choices.length === 0) {
        throw new Error('No integration found to apply context to.')
      }
      const integrationsIdsToApplyContextTo = await multiSelect.select({
        message: 'select',
        options: choices,
      })
      this.log(
        ux.colorize(
          'cyan',
          `\nApplying Context ID ${selectedContext.id} on integrations ${integrationsIdsToApplyContextTo.join(',')}\n`,
        ),
      )

      const integrationsToApplyContextTo = integrationsForConnectionId.data.filter((x) =>
        integrationsIdsToApplyContextTo.includes(x.id),
      )
      for (const integration of integrationsToApplyContextTo) {
        await applyContext(tenantId, installId, selectedContext.id, integration.org_id)
      }

      this.log(ux.colorize('red', 'Contexts Apply Workflow completed.'))
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
