import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm, input} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Create Deployment Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const metadata: Record<string, string> = {}
      while (
        await confirm({
          message: `Do you want to add one more metadata entry (key/value paid)?`,
        })
      ) {
        const key = await input({message: 'Enter metadata key.'})
        const value = await input({message: 'Enter metadata value.'})
        metadata[key] = value
      }

      const newDeployment = await this.createNewDeployment(tenantId, installId, appInstalledOnOrgId, metadata)

      this.log(ux.colorize('cyan', `Created Deployment ${newDeployment.data.id}.\n`))
      this.log(printFormattedJSON(newDeployment.data))
      this.log(ux.colorize('red', 'Deployment Create Workflow completed.'))
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
