import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {createIntegrationForConnection} from '../../../api/integrations.js'
import {validatedInput, ValidationType} from '../../../utils/input-validation.js'
import {STATUS} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Connection Create Integration(s) Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      this.logStatus(
        ux.colorize(
          'cyan',
          `Selected Connection ID ${selectedConnection.id}. Ready to configure integrations to use this Connection.\n`,
        ),
      )

      const orgId = await validatedInput({message: 'Enter the OrgID you want to integrate.'}, ValidationType.UUID)
      const connectionIntegration = await createIntegrationForConnection(
        tenantId,
        selectedConnection.id,
        selectedConnection.type,
        orgId,
      )
      if (connectionIntegration.errors) {
        this.error(JSON.stringify(connectionIntegration.errors))
      }
      this.logStatus(
        ux.colorize(
          'cyan',
          `Connection ${selectedConnection.id} (type: ${selectedConnection.type}) integrated with integration ${connectionIntegration.data.id} on Org ${orgId}.`,
        ),
      )
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
