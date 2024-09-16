import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm, input} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON} from '../../../utils/display.js'
import {validatedInput, ValidationType} from '../../../utils/input-validation.js'
import {getDeployments, updateDeployment} from '../../../api/deployments.js'
import * as multiSelect from 'inquirer-select-pro'

export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Update Deployment Workflow'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      const updateInstallId = await validatedInput(
        {message: 'Enter current or new Install ID', default: installId},
        ValidationType.UUID,
      )
      const updatedAppInstalledOnOrgId = await validatedInput(
        {message: 'Enter current or new Org ID where Snyk Broker App is installed', default: appInstalledOnOrgId},
        ValidationType.UUID,
      )
      const deployments = await getDeployments(tenantId, installId)
      const deployment = deployments.data?.find((x) => x.id === deploymentId)
      this.log(ux.colorize('yellow', 'Current Metadata values'))
      this.log(printFormattedJSON(deployment?.attributes.metadata))
      const metadata: Record<string, string> = deployment?.attributes.metadata ?? {}

      const existingKeysChoices = Object.keys(metadata).map((x) => {
        return {value: x, name: `[${x}]: ${metadata[x]}`}
      })
      const keysToDelete = await multiSelect.select({
        message: 'Which metadata entry do you want to remove?',
        options: existingKeysChoices,
      })

      for (const key of keysToDelete) {
        delete metadata[key]
      }
      if (Object.keys(metadata).length > 0) {
        this.log(ux.colorize('yellow', 'Remaining Metadata values'))
        this.log(printFormattedJSON(metadata))
      }
      while (
        await confirm({
          message: `Do you want to add one more metadata entry (key/value pair, i.e my cluster region/us-east-1)?`,
        })
      ) {
        const key = await input({message: 'Enter metadata key.'})
        const value = await input({message: 'Enter metadata value.'})
        metadata[key] = value
      }
      this.log(ux.colorize('yellow', 'Updating deployment with following Metadata values'))
      this.log(printFormattedJSON(metadata ?? {}))

      const updatedDeployment = await updateDeployment(tenantId, installId, deploymentId, metadata, {
        broker_app_installed_in_org_id: updatedAppInstalledOnOrgId,
        install_id: updateInstallId,
      })

      this.log(ux.colorize('cyan', `Updated Deployment ${updatedDeployment.data.id}.\n`))
      this.log(printFormattedJSON(updatedDeployment.data))
      if (updatedDeployment.data.attributes.install_id != installId) {
        this.log(ux.colorize('red', 'CAUTION'))
        this.log(
          ux.colorize('red', 'Your install ID changed, make sure to update your INSTALL_ID environment variable !'),
        )
      }

      this.log(ux.colorize('red', 'Deployment Update Workflow completed.'))
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
