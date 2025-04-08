// src/baseCommand.ts
import {Command, Flags, Interfaces, ux} from '@oclif/core'
import {getConfig} from './config/config.js'
import {input, confirm, select} from '@inquirer/prompts'
import {isValidUUID} from './utils/validation.js'
import {getAppInstalledOnOrgId, installAppsWorfklow} from './workflows/apps.js'
import {createDeployment, DeploymentAttributes, DeploymentResponse, getDeployments} from './api/deployments.js'
import {
  ConnectionId,
  ConnectionSelection,
  ContextSelection,
  DeploymentId,
  InstallId,
  SetupParameters,
  TenantId,
} from './types.js'
import {getConnectionsForDeployment, createConnectionForDeployment} from './api/connections.js'
import {captureConnectionParams} from './command-helpers/connections/parameters-capture.js'
import {getAccessibleTenants, getTenantRole} from './api/tenants.js'
import {validatedInput, ValidationType} from './utils/input-validation.js'
import {validateSnykToken} from './api/snyk.js'
import {getContextForForDeployment} from './api/contexts.js'

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

  async setupFlow(skipOrgId = false): Promise<SetupParameters> {
    if (!process.env.SNYK_TOKEN) {
      process.env.SNYK_TOKEN = await input({message: 'Enter your Snyk Token'})

      this.log(ux.colorize('yellow', `\nTIPS`))
      this.log(ux.colorize('yellow', `For smoother experience, please set the Snyk Token as env variable.`))
      this.log(ux.colorize('yellow', `Linux/Mac: export SNYK_TOKEN=${process.env.SNYK_TOKEN}`))
      this.log(ux.colorize('yellow', `Windows: set SNYK_TOKEN=${process.env.SNYK_TOKEN}\n`))
    }

    try {
      await validateSnykToken(process.env.SNYK_TOKEN)
      this.log(`✓ Valid Snyk Token.`)
    } catch (error) {
      this.error(`Invalid Snyk Token. ${error}`)
    }
    if (!process.env.TENANT_ID) {
      const accessibleTenants = await getAccessibleTenants()
      if (accessibleTenants.data.length === 0) {
        this.error(
          'No Tenant accessible with your credentials. A Tenant is required for Universal Broker. Personal organizations are not compatible.',
        )
      } else if (accessibleTenants.data.length === 1) {
        process.env.TENANT_ID = accessibleTenants.data[0].id
        this.log(ux.colorize('yellow', `✓ Found single accessible Tenant. Using ${process.env.TENANT_ID}.`))
      } else {
        this.log(
          ux.colorize(
            'blueBright',
            `Your credentials can access tenants:\n${accessibleTenants.data.map((x) => `- ${x.attributes.name}: ${x.id}`).join(',\n')}.\n`,
          ),
        )
        this.log(
          ux.colorize(
            'yellow',
            `export TENANT_ID=${process.env.TENANT_ID} (Windows: set TENANT_ID=${process.env.TENANT_ID}) to avoid inputting this for each command.\n`,
          ),
        )
      }
    }

    const tenantId =
      process.env.TENANT_ID ?? (await validatedInput({message: 'Enter your tenantID.'}, ValidationType.UUID))
    process.env.TENANT_ID = tenantId

    try {
      await getTenantRole(tenantId)
      this.log(`✓ Tenant Admin role confirmed.`)
    } catch (error) {
      this.debug(error)
      this.error(
        `This tool requires Tenant Admin role. Please use a Tenant level Admin account or upgrade your account to be Tenant Admin.`,
      )
    }

    let orgId
    let installId
    if (process.env.INSTALL_ID) {
      installId = process.env.INSTALL_ID
    } else if (await confirm({message: 'Have you installed the Broker App against an Org?'})) {
      installId = await validatedInput({message: 'Enter your Broker App Install ID'}, ValidationType.UUID)
      if (!isValidUUID(installId)) {
        this.error(`Must be a valid UUID.`)
      }
      // process.env.INSTALL_ID = installId
    } else {
      orgId = await validatedInput(
        {message: `Enter Org ID to install Broker App. Must be in Tenant ${tenantId}`},
        ValidationType.UUID,
      )
      const appInstall = await installAppsWorfklow(orgId)
      if (typeof appInstall === 'string') {
        this.log(ux.colorize('blueBright', `Found an App already installed. Using Install ID ${appInstall}.`))
        installId = appInstall
      } else {
        const {install_id, client_id, client_secret} = appInstall
        installId = install_id
        this.log(ux.colorize('red', `\nIMPORTANT !`))
        this.log(ux.colorize('red', `App installed. Please store the following credentials securely:`))
        this.log(ux.colorize('red', `- clientId: ${client_id}`))
        this.log(ux.colorize('red', `- clientSecret: ${client_secret}`))
        this.log(ux.colorize('red', `You will need them to run your Broker Client.\n`))
        while (!(await confirm({message: 'Have you saved these credentials?'}))) {
          this.log(ux.colorize('red', 'The client secret will never be visible again. Please save them securely.'))
        }
        this.log(ux.colorize('yellow', `\nFor smoother experience, please set the environment variable listed above.`))
        this.log(ux.colorize('yellow', `Linux/Mac: export INSTALL_ID=${installId}`))
        this.log(ux.colorize('yellow', `Windows: set INSTALL_ID=${installId}\n`))
        if (!(await confirm({message: `Continue?`}))) {
          process.exit(0)
        }
      }
    }

    if (skipOrgId) {
      orgId = 'dummy'
    }
    const appInstalledOnOrgId = orgId ?? (await getAppInstalledOnOrgId(tenantId, installId))
    return {installId, tenantId, appInstalledOnOrgId}
  }

  async selectDeployment(tenantId: string, installId: string, appInstalledOnOrgId: string): Promise<DeploymentId> {
    const deployments = await getDeployments(tenantId, installId)
    let deploymentId
    if (deployments.errors) {
      this.log(`${deployments.errors[0].detail}`)
      this.error(`Please create a first connection by using the "workflows connections create" command.`)
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
    let connectionFriendlyName = await input({message: 'Enter a human friendly name for your Connection.'})
    while (!regex.test(connectionFriendlyName)) {
      connectionFriendlyName = await input({
        message: 'Please use only [a-Z0-9_-]. Enter a human friendly name for your Connection.',
      })
    }
    while (existingConnections.data.map((x) => x.attributes.name).includes(connectionFriendlyName)) {
      connectionFriendlyName = await input({
        message: 'Name is already in use. Please enter a unique human friendly name for your Connection.',
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
      this.error('No Connection found.')
    }
    const selectedConnection =
      existingConnections.data.length === 1
        ? existingConnections.data[0].id
        : await select({
            message: 'Which Connection do you want to use?',
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

  async selectContext(tenantID: TenantId, installId: InstallId, deploymentId: DeploymentId): Promise<ContextSelection> {
    const existingContexts = await getContextForForDeployment(tenantID, installId, deploymentId)
    if (existingContexts.data.length === 0) {
      this.error('No Context found.')
    }

    const selectedContext =
      existingContexts.data.length === 1
        ? existingContexts.data[0].id
        : await select({
            message: 'Which Context do you want to select?',
            choices: existingContexts.data.map((x) => {
              return {
                id: x.id,
                value: x.id,
                description: `id: ${x.id}, linked to connection ${x.relationships?.broker_connections[0].data.id} (${x.relationships?.broker_connections[0].data.type}) ,context: ${JSON.stringify(x.attributes.context)}}`,
              }
            }),
          })
    const selectContextData = existingContexts.data.find((x) => x.id === selectedContext)
    if (!selectContextData) {
      throw new Error('Error selecting context - context not found.')
    }
    if (!selectContextData.relationships?.broker_connections[0].data.id) {
      throw new Error('Error selecting context - no associated connection found.')
    }
    return {
      id: selectContextData?.id,
      context: selectContextData?.attributes.context,
      connectionId: selectContextData.relationships?.broker_connections[0].data.id,
    }
  }

  protected async catch(err: Error & {exitCode?: number}): Promise<any> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    this.error(err.message)
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }
}
