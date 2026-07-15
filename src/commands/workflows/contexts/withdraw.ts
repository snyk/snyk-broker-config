import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'

import {getIntegrationsForConnection} from '../../../api/integrations.js'
import * as multiSelect from 'inquirer-select-pro'
import {withdrawContext} from '../../../api/contexts.js'
import {STATUS} from '../../../utils/display.js'
export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Withdraw Contexts Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const selectedContext = await this.selectContext(tenantId, installId, deploymentId)

      this.logStatus(
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
      const integrationsIdsToWithdrawContextTo = await multiSelect.select({
        message: 'select',
        options: choices,
      })
      this.logStatus(
        ux.colorize(
          'cyan',
          `\nwithdrawing Context ID ${selectedContext.id} on integrations ${integrationsIdsToWithdrawContextTo.join(',')}\n`,
        ),
      )

      const integrationsToApplyContextTo = integrationsForConnectionId.data.filter((x) =>
        integrationsIdsToWithdrawContextTo.includes(x.id),
      )
      for (const integration of integrationsToApplyContextTo) {
        if (
          await confirm({
            message: `Are you sure you want to withdraw context ${selectedContext.id} from integration ${integration.id} (org ${integration.org_id}}) ?`,
          })
        ) {
          this.logStatus(ux.colorize('cyan', `Withdrawing Context ${selectedContext.id}`))
          await withdrawContext(tenantId, installId, selectedContext.id, integration.id)
        } else {
          this.logStatus(ux.colorize('cyan', 'Canceling.'))
        }
      }

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Contexts Withdraw Workflow completed.`))
      return selectedContext
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
