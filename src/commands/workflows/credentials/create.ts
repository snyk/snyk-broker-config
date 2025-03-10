import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {input, select} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {connectionTypes} from '../../../command-helpers/connections/type-params-mapping.js'
import {CredentialsAttributes} from '../../../api/types.js'
import {createCredentials} from '../../../api/credentials.js'
import {printFormattedJSON} from '../../../utils/display.js'
import {validatedInput, ValidationType} from '../../../utils/input-validation.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Create Credentials Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const deploymentId = await this.setupOrSelectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      const attributes: CredentialsAttributes[] = []
      const type = await select({
        message: 'Which credentials type do you want to create?',
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
      const env_var_name = await validatedInput(
        {
          message: 'Enter the credentials reference environment variable name.',
        },
        ValidationType.ENVVAR,
      )
      const comment =
        (await input({
          message: 'Enter a helpful comment to identify this credentials reference among others.',
        })) ?? ''

      for (const envVarName of env_var_name.split(',')) {
        attributes.push({comment: comment, environment_variable_name: envVarName, type: type})
      }

      const credentials = await createCredentials(tenantId, installId, deploymentId, attributes)
      const credentialsResponse = credentials.data
      this.log(
        ux.colorize(
          'cyan',
          `Creating Universal Broker Credentials for Deployment ${deploymentId} for Tenant ${tenantId}, Install ${installId}`,
        ),
      )
      this.log(printFormattedJSON(credentialsResponse))

      this.log(ux.colorize('red', 'Credentials Create Workflow completed.'))
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
