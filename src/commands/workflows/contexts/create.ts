import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {captureConnectionParams} from '../../../command-helpers/connections/parameters-capture.js'
import {getParametersForConnectionType} from '../../../command-helpers/connections/type-params-mapping.js'
import * as multiSelect from 'inquirer-select-pro'
import {selectObjectMembersByKeys} from '../../../utils/utils.js'
import {createContextForConnection} from '../../../api/contexts.js'
import {printFormattedJSON, STATUS} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Create Context Workflow'

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
          `Selected Connection ID ${selectedConnection.id}. Ready to create context to use for this Connection.\n`,
        ),
      )
      const allowedParameters = getParametersForConnectionType(selectedConnection.type)

      const allowedParametersKeys = Object.keys(allowedParameters)
      const selectedParametersToOverride = await multiSelect.select({
        message: 'Which parameter(s) do you want to override with a context?',
        options: allowedParametersKeys.map((x) => {
          return {
            value: x,
            name: `name: ${x}, details: ${allowedParameters[x].description}`,
          }
        }),
      })
      if (selectedParametersToOverride.length === 0) {
        throw new Error('At least one parameter must be selected for override to create a context.')
      }
      const params = await captureConnectionParams(
        tenantId,
        installId,
        deploymentId,
        selectedConnection.type,
        selectObjectMembersByKeys(allowedParameters, selectedParametersToOverride),
      )

      const createdContext = await createContextForConnection(
        tenantId,
        installId,
        deploymentId,
        selectedConnection.id,
        params,
      )
      this.log(printFormattedJSON(createdContext.data))
      this.logStatus(
        ux.colorize(
          'cyan',
          `Context created overriding ${Object.keys(createdContext.data.attributes.context).join(',')} if used in integrations for Connection ${selectedConnection.id} (type: ${selectedConnection.type}).`,
        ),
      )

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Context Create Workflow completed.`))
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
