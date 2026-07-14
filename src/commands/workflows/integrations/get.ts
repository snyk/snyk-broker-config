import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON, STATUS} from '../../../utils/display.js'
import {getIntegrationsForConnection} from '../../../api/integrations.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Get Connection Integration Workflow'

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
      this.logStatus(ux.colorize('cyan', `Selected Connection ID ${selectedConnection.id}.\n`))
      // const selectedConnectionData = await getConnectionsForDeployment(tenantId, installId, deploymentId)
      const integrations = await getIntegrationsForConnection(tenantId, selectedConnection.id)
      const integrationsList = integrations.data ?? []
      if (integrationsList.length === 0) {
        throw new Error(`No Integrations found for connection ${selectedConnection.id} (${selectedConnection.type})`)
      }
      this.log(printFormattedJSON(integrationsList))
      this.logStatus(ux.colorize('green', `${STATUS.DONE} Connection Integration listing Workflow completed.`))
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
