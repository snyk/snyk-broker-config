import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {input} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {getConnectionsForDeployment, updateConnectionForDeployment} from '../../../api/connections.js'
import {captureConnectionParams} from '../../../command-helpers/connections/parameters-capture.js'
import {printFormattedJSON, STATUS} from '../../../utils/display.js'

export default class WorkflowsConnectionsUpdate extends BaseCommand<typeof WorkflowsConnectionsUpdate> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Update Connection Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(WorkflowsConnectionsUpdate.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      // Access type via attributes.configuration.type now
      const connectionType = selectedConnection.type
      this.logStatus(
        ux.colorize(
          'cyan',
          `Selected Connection ID ${selectedConnection.id} of type ${connectionType}. Ready to update Connection.\n`,
        ),
      )
      const selectedConnectionData = await getConnectionsForDeployment(tenantId, installId, deploymentId)
      this.logStatus(ux.colorize('cyan', '\nCurrent connection details:'))
      this.log(printFormattedJSON(selectedConnectionData.data.find((x) => x.id === selectedConnection.id)))
      this.logStatus(ux.colorize('cyan', '\nEnter updated values below:'))

      const friendlyName = await input({
        message: 'Enter a new friendly name for the connection (leave blank to keep current)',
        default: selectedConnection.name,
      })

      this.logStatus(ux.colorize('cyan', `Capturing parameters for connection type ${selectedConnection.type}...`))

      const currentConnection = selectedConnectionData.data.find((x) => x.id === selectedConnection.id)
      const currentConfigurationValues = currentConnection?.attributes?.configuration?.required || {}

      const updatedParameters = await captureConnectionParams(
        tenantId,
        installId,
        deploymentId,
        connectionType, // Use the extracted type
        undefined,
        currentConfigurationValues,
      )

      this.logStatus(ux.colorize('cyan', `Updating Connection ${selectedConnection.id}`))
      await updateConnectionForDeployment(
        tenantId,
        installId,
        deploymentId,
        selectedConnection.id,
        friendlyName,
        connectionType, // Use the extracted type
        updatedParameters,
      )

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Connection ${selectedConnection.id} updated successfully.`))
      this.logStatus(ux.colorize('green', `${STATUS.DONE} Connection Update Workflow completed.`))
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
