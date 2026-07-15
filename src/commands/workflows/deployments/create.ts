import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm, input} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON, STATUS} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Create Deployment Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const metadata: Record<string, string> = {}
      while (
        await confirm({
          message: `Do you want to add one more metadata entry (key/value pair, e.g my cluster region/us-east-1)?`,
        })
      ) {
        const key = await input({message: 'Enter metadata key.'})
        const value = await input({message: 'Enter metadata value.'})
        metadata[key] = value
      }

      const newDeployment = await this.createNewDeployment(tenantId, installId, appInstalledOnOrgId, metadata)

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Created Deployment ${newDeployment.data.id}.\n`))
      this.log(printFormattedJSON(newDeployment.data))
      this.logStatus(ux.colorize('green', `${STATUS.DONE} Deployment Create Workflow completed.`))
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
