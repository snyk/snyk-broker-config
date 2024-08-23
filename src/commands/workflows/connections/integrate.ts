import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {input} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {nonSourceIntegrations} from '../../../command-helpers/connections/type-params-mapping.js'
import {createIntegrationForConnection} from '../../../api/integrations.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Connection Create Integration(s) workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))
      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      this.log(
        ux.colorize(
          'cyan',
          `Selected connection id ${selectedConnection.id}. Ready to configure integrations to use this connection.\n`,
        ),
      )
      const orgId = await input({message: 'Enter the OrgID you want to integrate.'})
      let integrationId
      if (!nonSourceIntegrations.has(selectedConnection.type)) {
        integrationId = await input({
          message: `Enter the integrationID you want to integrate. Must be of type ${selectedConnection.type}`,
        })
      }
      const connectionIntegration = await createIntegrationForConnection(
        tenantId,
        selectedConnection.id,
        selectedConnection.type,
        orgId,
        integrationId,
      )
      if (connectionIntegration.errors) {
        this.error(ux.colorize('red', JSON.stringify(connectionIntegration.errors)))
      }
      this.log(
        ux.colorize(
          'cyan',
          `Connection ${connectionIntegration.data.id} (type: ${selectedConnection.type}) integrated with integration ${integrationId} on org ${orgId}.`,
        ),
      )
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
