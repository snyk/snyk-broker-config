import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {deleteIntegrationsForConnection, getIntegrationsForConnection} from '../../../api/integrations.js'
import * as multiSelect from 'inquirer-select-pro'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker -  Connection Disconnect Integration(s) Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))
      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      this.log(
        ux.colorize(
          'cyan',
          `Selected Connection id ${selectedConnection.id}. Ready to disconnect integrations using this Connection.\n`,
        ),
      )
      const integrationsForConnectionId = await getIntegrationsForConnection(tenantId, selectedConnection.id)
      const choices = integrationsForConnectionId.data.map((x) => {
        return {name: `[Type: ${x.integration_type}] in ${x.org_id} (integr ${x.id})`, value: x.id}
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
          this.log(ux.colorize('blue', `Disconnecting integration ${integrationId}`))
          await deleteIntegrationsForConnection(
            tenantId,
            selectedConnection.id,
            integrationsForConnectionId.data.find((x) => x.id === integrationId)!.org_id,
            integrationId,
          )
        }
      } else {
        this.log(ux.colorize('cyan', 'Canceling.'))
      }

      this.log(ux.colorize('red', 'Connection Integrate Workflow completed.'))
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
