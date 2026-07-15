import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../../common/args.js'
import {confirm, input} from '@inquirer/prompts'
import {BaseCommand} from '../../../base-command.js'
import {printFormattedJSON, STATUS} from '../../../utils/display.js'
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

  async run() {
    try {
      this.heading(Workflows.description)

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId)
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
      this.logStatus(ux.colorize('cyan', 'Current Metadata values'))
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
        this.logStatus(ux.colorize('cyan', 'Remaining Metadata values'))
        this.log(printFormattedJSON(metadata))
      }
      while (
        await confirm({
          message: `Do you want to add one more metadata entry (key/value pair, e.g my cluster region/us-east-1)?`,
        })
      ) {
        const key = await input({message: 'Enter metadata key.'})
        const value = await input({message: 'Enter metadata value.'})
        metadata[key] = value
      }
      this.logStatus(ux.colorize('cyan', 'Updating deployment with following Metadata values'))
      this.log(printFormattedJSON(metadata ?? {}))

      const updatedDeployment = await updateDeployment(tenantId, installId, deploymentId, metadata, {
        broker_app_installed_in_org_id: updatedAppInstalledOnOrgId,
        install_id: updateInstallId,
      })

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Updated Deployment ${updatedDeployment.data.id}.\n`))
      this.log(printFormattedJSON(updatedDeployment.data))
      if (updatedDeployment.data.attributes.install_id !== installId) {
        this.logStatus(ux.colorize('yellow', `${STATUS.WARN} CAUTION`))
        this.logStatus(
          ux.colorize('yellow', 'Your install ID changed, make sure to update your INSTALL_ID environment variable !'),
        )
      }

      this.logStatus(ux.colorize('green', `${STATUS.DONE} Deployment Update Workflow completed.`))
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
