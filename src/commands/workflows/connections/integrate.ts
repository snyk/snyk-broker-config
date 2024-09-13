import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {input} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {nonSourceIntegrations} from '../../../command-helpers/connections/type-params-mapping.js'
import {createIntegrationForConnection} from '../../../api/integrations.js'
import {validatedInput, ValidationType} from '../../../utils/input-validation.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Connection Create Integration(s) Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      this.log(
        ux.colorize(
          'cyan',
          `Selected Connection ID ${selectedConnection.id}. Ready to configure integrations to use this Connection.\n`,
        ),
      )

      const orgId = await validatedInput({message: 'Enter the OrgID you want to integrate.'}, ValidationType.UUID)
      let integrationId
      if (!nonSourceIntegrations.has(selectedConnection.type)) {
        integrationId = await validatedInput(
          {
            message: `Enter the integrationID you want to integrate. Must be of type ${selectedConnection.type}`,
          },
          ValidationType.UUID,
        )
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
          `Connection ${connectionIntegration.data.id} (type: ${selectedConnection.type}) integrated with integration ${integrationId} on Org ${orgId}.`,
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
