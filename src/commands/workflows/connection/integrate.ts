import {ux} from '@oclif/core'
import {commonApiRelatedArgs, commonUniversalBrokerArgs} from '../../../common/args.js'
import {input, confirm, number, select} from '@inquirer/prompts'
import {getAppInstalledOnOrgId, installAppsWorfklow} from '../../../workflows/apps.js'
import {createDeployment, DeploymentAttributes, DeploymentResponse, getDeployments} from '../../../api/deployments.js'
import {printIndexedFormattedJSON} from '../../../utils/display.js'
import {isValidUUID} from '../../../utils/validation.js'
import {BaseCommand} from '../../../base-command.js'
import {
  connectionTypes,
  flagConnectionMapping,
  nonSourceIntegrations,
} from '../../../command-helpers/connections/type-params-mapping.js'
import {captureConnectionParams} from '../../../command-helpers/connections/parameters-capture.js'
import {createConnectionForDeployment, getConnectionsForDeployment} from '../../../api/connections.js'
import {createIntegrationForConnection} from '../../../api/integrations.js'

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

  static description = 'Universal Broker - workflows'

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

  async selectDeployment(tenantId: string, installId: string, appInstalledOnOrgId: string): Promise<DeploymentId> {
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
    const selectedConnection =
      existingConnections.data.length === 1
        ? existingConnections.data[0].id
        : await select({
            message: 'Which deployment do you want to use?',
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
    const orgId = await input({message: 'Enter the OrgID you want to integrate.'})
    let integrationId
    if (!nonSourceIntegrations.has(selectedConnection.type)) {
      integrationId = await input({
        message: `Enter the integrationID you want to integrate. Must be of type ${selectedConnection.type}`,
      })
    }
    const connectionIntegration = await createIntegrationForConnection(
      tenantId,
      selectedConnection.id,
      selectedConnection.type,
      orgId,
      integrationId,
    )
    return JSON.stringify('')
  }
}
