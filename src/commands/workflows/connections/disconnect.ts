import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {deleteIntegrationsForConnection, getIntegrationsForConnection} from '../../../api/integrations.js'
import * as multiSelect from 'inquirer-select-pro'
import {STATUS} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Connection Disconnect Integration(s) Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))
      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      this.logStatus(
        ux.colorize(
          'cyan',
          `Selected Connection id ${selectedConnection.id}. Ready to disconnect integrations using this Connection.\n`,
        ),
      )
      const integrationsForConnectionId = await getIntegrationsForConnection(tenantId, selectedConnection.id)
      const choices = integrationsForConnectionId.data.map((x) => {
        return {name: `[Type: ${x.integration_type}] in org ${x.org_id} (integration ${x.id})`, value: x.id}
      })
      if (choices.length === 0) {
        throw new Error('No integration found to disconnect.')
      }
      const integrationsIdsToDisconnect = await multiSelect.select({
        message: 'select',
        options: choices,
      })
      if (
        await confirm({
          message: `Are you sure you want to disconnect integration${integrationsIdsToDisconnect.length > 1 ? 's' : ''} ${integrationsIdsToDisconnect.join(',')} ?\n Doing so will interrupt service for these integrations.`,
        })
      ) {
        for (const integrationId of integrationsIdsToDisconnect) {
          this.logStatus(ux.colorize('cyan', `Disconnecting integration ${integrationId}`))
          await deleteIntegrationsForConnection(
            tenantId,
            selectedConnection.id,
            integrationsForConnectionId.data.find((x) => x.id === integrationId)!.org_id,
            integrationId,
          )
        }
      } else {
        this.logStatus(ux.colorize('cyan', 'Canceling.'))
      }

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Connection Integrate Workflow completed.`))
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
