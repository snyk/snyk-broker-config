// src/baseCommand.ts
import {Command, Flags, Interfaces, ux} from '@oclif/core'
import {getConfig} from './config/config.js'
import {input, confirm, select} from '@inquirer/prompts'
import {isValidUUID} from './utils/validation.js'
import {getAppInstalledOnOrgId, installAppsWorfklow} from './workflows/apps.js'
import {createDeployment, DeploymentAttributes, DeploymentResponse, getDeployments} from './api/deployments.js'
import {ConnectionId, ConnectionSelection, DeploymentId, InstallId, SetupParameters, TenantId} from './types.js'
import {getConnectionsForDeployment, createConnectionForDeployment} from './api/connections.js'
import {captureConnectionParams} from './command-helpers/connections/parameters-capture.js'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // add the --json flag
  static enableJsonFlag = true

  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    'log-level': Flags.option({
      default: 'info',
      helpGroup: 'GLOBAL',
      options: ['debug', 'warn', 'error', 'info', 'trace'] as const,
      summary: 'Specify level for logging.',
    })(),
  }

  protected flags!: Flags<T>
  protected args!: Args<T>

  public async init(): Promise<void> {
    this.log(ux.colorize('yellow', `Using ${getConfig().API_HOSTNAME}.`))
    await super.init()
    const {args, flags} = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>
  }

  async setupFlow(): Promise<SetupParameters> {
    const snykToken = process.env.SNYK_TOKEN ?? (await input({message: 'Enter your Snyk Token'}))
    process.env.SNYK_TOKEN = snykToken

    const tenantId = process.env.TENANT_ID ?? (await input({message: 'Enter your tenantID'}))
    process.env.TENANT_ID = tenantId

    let orgId
    let installId
    if (process.env.INSTALL_ID) {
      installId = process.env.INSTALL_ID
    } else if (await confirm({message: 'Have you installed the Broker App against an org?'})) {
      installId = await input({message: 'Enter your Broker App Install ID'})
      if (!isValidUUID(installId)) {
        this.error(`Must be a valid UUID.`)
      }
      // process.env.INSTALL_ID = installId
    } else {
      orgId = await input({message: `Enter Org Id to install Broker App. Must be in tenant ${tenantId}`})
      const {install_id, client_id, client_secret} = await installAppsWorfklow(orgId)
      installId = install_id
      this.log(ux.colorize('purple', `App installed. Please store the following credentials securely:`))
      this.log(ux.colorize('purple', `- clientId: ${client_id}`))
      this.log(ux.colorize('purple', `- clientSecret: ${client_secret}`))
      this.log(ux.colorize('purple', `You will need them to run your Broker Client.`))
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
      this.error(`Please first create a Deployment by using the Create Workflow.`)
    } else if (deployments.data) {
      deploymentId =
        deployments.data.length === 1
          ? deployments.data[0].id
          : await select({
              message: 'Which Deployment do you want to use?',
              choices: deployments.data.map((x) => {
                return {id: x.id, value: x.id, description: `metadata: ${JSON.stringify(x.attributes.metadata)}`}
              }),
            })
    } else {
      this.error('Unexpected error in Deployment selection.')
    }
    return deploymentId
  }

  async createNewDeployment(
    tenantId: string,
    installId: string,
    appInstalledOnOrgId: string,
    metadata?: Record<string, string>,
  ): Promise<DeploymentResponse> {
    const attributes: DeploymentAttributes = {
      broker_app_installed_in_org_id: appInstalledOnOrgId,
      metadata: {
        createdAt: new Date().toUTCString(),
        comment: `Created interactively by snyk-broker-config`,
        ...metadata,
      },
    }
    const deployment = await createDeployment(tenantId, installId, attributes)
    return deployment
  }

  async setupOrSelectDeployment(
    tenantId: string,
    installId: string,
    appInstalledOnOrgId: string,
  ): Promise<DeploymentId> {
    const deployments = await getDeployments(tenantId, installId)
    let deploymentId
    if (deployments.errors) {
      this.log(`${deployments.errors[0].detail}`)
      if (await confirm({message: 'Do you want to create a new Deployment?'})) {
        const newDeployment = await this.createNewDeployment(tenantId, installId, appInstalledOnOrgId)
        deploymentId = newDeployment.data.id
      } else {
        this.error(
          'A Deployment is needed to get started. Please create one using the Deployment create command or running this workflow again. Exiting.',
        )
      }
    } else if (deployments.data) {
      deploymentId =
        deployments.data.length === 1
          ? deployments.data[0].id
          : await select({
              message: 'Which Deployment do you want to use?',
              choices: deployments.data.map((x) => {
                return {id: x.id, value: x.id, description: `metadata: ${JSON.stringify(x.attributes.metadata)}`}
              }),
            })
    } else {
      this.error('Unexpected error in Deployment selection.')
    }
    return deploymentId
  }

  async createNewConnection(
    tenantID: TenantId,
    installId: InstallId,
    deploymentId: DeploymentId,
    connectionType: string,
  ): Promise<ConnectionId> {
    const existingConnections = await getConnectionsForDeployment(tenantID, installId, deploymentId)
    const regex = /^[\w-]+$/ // Any word character. Avoiding problems that way.
    let connectionFriendlyName = await input({message: 'Enter a human friendly name for your connection.'})
    while (!regex.test(connectionFriendlyName)) {
      connectionFriendlyName = await input({
        message: 'Please use only [a-Z0-9_-]. Enter a human friendly name for your connection.',
      })
    }
    while (existingConnections.data.map((x) => x.attributes.name).includes(connectionFriendlyName)) {
      connectionFriendlyName = await input({
        message: 'Name is already in use. Please enter a unique human friendly name for your connection.',
      })
    }
    const params = await captureConnectionParams(tenantID, installId, deploymentId, connectionType)
    const newConnection = await createConnectionForDeployment(
      tenantID,
      installId,
      deploymentId,
      connectionFriendlyName,
      connectionType,
      params,
    )
    return newConnection.data.id
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

  protected async catch(err: Error & {exitCode?: number}): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }
}
