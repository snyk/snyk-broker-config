import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON} from '../../../utils/display.js'
import {getCredentialsForDeployment} from '../../../api/credentials.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Get Credentials Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const credentials = await getCredentialsForDeployment(tenantId, installId, deploymentId!)
      const credentialsList = credentials.data

      this.log(
        ux.colorize(
          'cyan',
          `Getting Universal Broker Credentials for Deployment ${deploymentId}, Tenant ${tenantId}, Install ${installId}`,
        ),
      )
      for (const credential of credentialsList) {
        this.log(printFormattedJSON(credential))
      }
      this.log(`Total = ${credentialsList.length}`)
      this.log(ux.colorize('red', 'Credentials Listing Workflow completed.'))
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
