import {ux} from '@oclif/core'
import {commonApiRelatedArgs, commonUniversalBrokerArgs} from '../../../common/args.js'
import {confirm} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import * as multiSelect from 'inquirer-select-pro'
import {deleteCredentials, getCredentialForDeployment, getCredentialsForDeployment} from '../../../api/credentials.js'
import {STATUS} from '../../../utils/display.js'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Credentials Deletion Workflow'

  static examples = [
    `[with exported TENANT_ID, INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %>`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))

      const credentials = await getCredentialsForDeployment(tenantId, installId, deploymentId)

      if (credentials.data.length === 0) {
        this.error(`No credentials found.`)
      }

      const choices = credentials.data.map((x) => {
        return {
          name: `[Type: ${x.attributes.type}] ${x.attributes.environment_variable_name} (${x.attributes.comment})`,
          value: x.id,
        }
      })
      const credentialsIdsToDelete = await multiSelect.select({
        message: 'select',
        options: choices,
      })

      if (
        await confirm({
          message: `Are you sure you want to delete credentials ${credentialsIdsToDelete.join(',')} ?`,
        })
      ) {
        for (const credentialsId of credentialsIdsToDelete) {
          this.logStatus(ux.colorize('cyan', `Deleting credentials ${credentialsId}`))
          const credential = await getCredentialForDeployment(tenantId, installId, deploymentId, credentialsId)
          if (credential.data.relationships && credential.data.relationships.broker_connections.length > 0) {
            this.logStatus(
              ux.colorize(
                'yellow',
                `${STATUS.WARN} Cannot delete ${credentialsId}. In use by ${credential.data.relationships.broker_connections.length} Connection ${credential.data.relationships.broker_connections.length > 1 ? 's' : ''} (${credential.data.relationships.broker_connections.map((x) => x.data.id).join(',')}). Skipping.`,
              ),
            )
            continue
          } else {
            await deleteCredentials(tenantId, installId, deploymentId, credentialsId)
          }
        }
      } else {
        this.logStatus(ux.colorize('cyan', 'Cancelling.'))
      }

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Credentials Deletion Workflow completed.`))
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
