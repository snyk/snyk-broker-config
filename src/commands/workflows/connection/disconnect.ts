import {ux} from '@oclif/core'
import {commonApiRelatedArgs, commonUniversalBrokerArgs} from '../../../common/args.js'
import {input, confirm, select} from '@inquirer/prompts'
import {getAppInstalledOnOrgId} from '../../../workflows/apps.js'
import {getDeployments} from '../../../api/deployments.js'
import {isValidUUID} from '../../../utils/validation.js'
import {BaseCommand} from '../../../base-command.js'
import {getConnectionsForDeployment} from '../../../api/connections.js'
import {deleteIntegrationsForConnection, getIntegrationsForConnection} from '../../../api/integrations.js'
import * as multiSelect from 'inquirer-select-pro'

interface SetupParameters {
  installId: string
  tenantId: string
  appInstalledOnOrgId: string
}

type TenantId = string
type InstallId = string
type DeploymentId = string
type ConnectionId = string
type ConnectionSelection = {id: ConnectionId; type: string}
export default class Workflows extends BaseCommand<typeof Workflows> {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker -  Connection Disconnect Integration(s) workflow'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %>`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async setupFlow(): Promise<SetupParameters> {
    const snykToken = process.env.SNYK_TOKEN ?? (await input({message: 'Enter your Snyk Token'}))
    process.env.SNYK_TOKEN = snykToken

    const tenantId = process.env.TENANT_ID ?? (await input({message: 'Enter your tenantID'}))
    process.env.TENANT_ID = tenantId

    let orgId
    let installId
    if (process.env.INSTALL_ID) {
      installId = process.env.INSTALL_ID
    } else if (await confirm({message: 'Have you installed the broker app against an org?'})) {
      installId = await input({message: 'Enter your Broker App Install ID'})
      if (!isValidUUID(installId)) {
        this.error(`Must be a valid UUID.`)
      }
      // process.env.INSTALL_ID = installId
    } else {
      this.error(`Please create a valid install first. You can use the create worklow.`)
    }
    await getDeployments(tenantId, installId)

    const appInstalledOnOrgId = orgId ?? (await getAppInstalledOnOrgId(tenantId, installId))
    return {installId, tenantId, appInstalledOnOrgId}
  }

  async selectDeployment(tenantId: string, installId: string, _appInstalledOnOrgId: string): Promise<DeploymentId> {
    const deployments = await getDeployments(tenantId, installId)
    let deploymentId
    if (deployments.errors) {
      this.log(`${deployments.errors[0].detail}`)
      this.error(`Please first create a deployment by using the create worklow.`)
    } else if (deployments.data) {
      deploymentId =
        deployments.data.length === 1
          ? deployments.data[0].id
          : await select({
              message: 'Which deployment do you want to use?',
              choices: deployments.data.map((x) => {
                return {id: x.id, value: x.id, description: `metadata: ${JSON.stringify(x.attributes.metadata)}`}
              }),
            })
    } else {
      this.error('Unexpected error in deployment selection.')
    }
    return deploymentId
  }

  async selectConnection(
    tenantID: TenantId,
    installId: InstallId,
    deploymentId: DeploymentId,
  ): Promise<ConnectionSelection> {
    const existingConnections = await getConnectionsForDeployment(tenantID, installId, deploymentId)
    if (existingConnections.data.length === 0) {
      this.error('No connection found.')
    }
    const selectedConnection =
      existingConnections.data.length === 1
        ? existingConnections.data[0].id
        : await select({
            message: 'Which connection do you want to use?',
            choices: existingConnections.data.map((x) => {
              return {
                id: x.id,
                value: x.id,
                description: `name: ${x.attributes.name}, type: ${x.attributes.configuration.type}, configuration: ${JSON.stringify(x.attributes.configuration)}`,
              }
            }),
          })
    const selectConnectionData = existingConnections.data.find((x) => x.id === selectedConnection)
    return {id: selectConnectionData!.id, type: selectConnectionData?.attributes.configuration.type}
  }

  async run(): Promise<string> {
    try {
      this.log('\n' + ux.colorize('red', Workflows.description))

      const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

      this.log(ux.colorize('cyan', `Now using Tenant Id ${tenantId} and Install Id ${installId}.\n`))

      const deploymentId = await this.selectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.log(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      // this.log(ux.colorize('cyan', `Let's create a ${connectionType} connection now.\n`))
      const selectedConnection = await this.selectConnection(tenantId, installId, deploymentId)
      this.log(
        ux.colorize(
          'cyan',
          `Selected connection id ${selectedConnection.id}. Ready to configure integrations to use this connection.\n`,
        ),
      )
      const integrationsForConnectionId = await getIntegrationsForConnection(tenantId, selectedConnection.id)
      const choices = integrationsForConnectionId.data.map((x) => {
        return {name: `[Type: ${x.integration_type}] in ${x.org_id} (integr ${x.id})`, value: x.id}
      })
      const integrationsIdsToDisconnect = await multiSelect.select({
        message: 'select',
        options: choices,
      })
      if (
        await confirm({
          message: `Are you sure you want to disconnect integration${integrationsIdsToDisconnect.length > 1 ? 's' : ''} ${integrationsIdsToDisconnect.join(',')} ?\n Doing so will interrupt service for these integrations.`,
        })
      ) {
        for (const integrationId of integrationsIdsToDisconnect) {
          this.log(ux.colorize('blue', `Disconnecting integration ${integrationId}`))
          await deleteIntegrationsForConnection(
            tenantId,
            selectedConnection.id,
            integrationsForConnectionId.data.find((x) => x.id === integrationId)!.org_id,
            integrationId,
          )
        }
      } else {
        this.log(ux.colorize('cyan', 'Canceling.'))
      }

      this.log(ux.colorize('red', 'Connection Integrate Workflow completed.'))
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
