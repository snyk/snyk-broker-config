import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON, STATUS} from '../../../utils/display.js'
import {getCredentialsForDeployment} from '../../../api/credentials.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Get Credentials Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const credentials = await getCredentialsForDeployment(tenantId, installId, deploymentId!)
      const credentialsList = credentials.data

      this.logStatus(
        ux.colorize(
          'cyan',
          `Getting Universal Broker Credentials for Deployment ${deploymentId}, Tenant ${tenantId}, Install ${installId}`,
        ),
      )
      for (const credential of credentialsList) {
        this.log(printFormattedJSON(credential))
      }
      this.logStatus(`Total = ${credentialsList.length}`)
      this.logStatus(ux.colorize('green', `${STATUS.DONE} Credentials Listing Workflow completed.`))
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
