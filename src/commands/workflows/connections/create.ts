import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {select} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {connectionTypes} from '../../../command-helpers/connections/type-params-mapping.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Create Connection Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.setupOrSelectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      this.log(
        ux.colorize(
          'yellow',
          `Helpful tip ! You can use a credentials reference for any field by simply entering the creds ref UUID. Use workflows credentials create|get to create|list available credentials reference(s).\n`,
        ),
      )

      const connectionType = await select({
        message: 'Which Connection type do you want to create?',
        choices: connectionTypes
          .map((x) => {
            return {id: x, value: x}
          })
          .sort((a, b) => {
            const valueA = a.value.toLowerCase()
            const valueB = b.value.toLowerCase()

            if (valueA < valueB) {
              return -1
            }
            if (valueA > valueB) {
              return 1
            }
            return 0
          }),
        pageSize: connectionTypes.length,
      })
      this.log(ux.colorize('cyan', `Let's create a ${connectionType} Connection now.\n`))
      const connectionId = await this.createNewConnection(tenantId, installId, deploymentId, connectionType)
      this.log(
        ux.colorize(
          'cyan',
          `Connection created with ID ${connectionId}. Ready to configure integrations to use this Connection.\n`,
        ),
      )
      this.log(ux.colorize('red', 'Connection Create Workflow completed.'))
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
