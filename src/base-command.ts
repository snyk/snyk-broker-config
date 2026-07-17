// src/baseCommand.ts
import {Command, Flags, Interfaces, ux} from '@oclif/core'
import {getConfig} from './config/config.js'
import {input, confirm, select} from '@inquirer/prompts'
import {installAppsWorfklow} from './workflows/apps.js'
import {
  createDeployment,
  DeploymentAttributes,
  DeploymentResponse,
  getDeployments,
  getDeploymentsForTenant,
} from './api/deployments.js'
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
import {getAccessibleTenants, isTenantAdmin} from './api/tenants.js'
import {validatedInput, ValidationType} from './utils/input-validation.js'
import {validateSnykToken} from './api/snyk.js'
import {getContextsForForDeployment} from './api/contexts.js'
import {ApiError, NetworkError} from './utils/errors.js'
import {STATUS} from './utils/display.js'

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

  // Status/progress messages go to stderr so stdout carries only the data payload.
  protected logStatus(message = ''): void {
    this.logToStderr(message)
  }

  // Section title, rendered as an informational heading on stderr.
  protected heading(text: string): void {
    this.logToStderr(ux.colorize('cyan', text))
  }

  public async init(): Promise<void> {
    this.logStatus(ux.colorize('cyan', `Using ${getConfig().API_HOSTNAME}.`))
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

      this.logStatus(
        ux.colorize('cyan', `\n${STATUS.TIP} For a smoother experience, please set the Snyk Token as env variable.`),
      )
      this.logStatus(ux.colorize('cyan', `Linux/Mac: export SNYK_TOKEN=${process.env.SNYK_TOKEN}`))
      this.logStatus(ux.colorize('cyan', `Windows: set SNYK_TOKEN=${process.env.SNYK_TOKEN}\n`))
    }

    let userId: string
    try {
      userId = await validateSnykToken(process.env.SNYK_TOKEN)
      this.logStatus(ux.colorize('green', `${STATUS.OK} Valid Snyk Token for user ${userId}.`))
    } catch (error) {
      this.error(error instanceof Error ? error.message : String(error))
    }
    let tenantIdPrompted = false
    if (!process.env.TENANT_ID) {
      const accessibleTenants = await getAccessibleTenants()
      if (accessibleTenants.data.length === 0) {
        this.error(
          'No Tenant accessible with your credentials. A Tenant is required for Universal Broker. Personal organizations are not compatible.',
        )
      } else if (accessibleTenants.data.length === 1) {
        process.env.TENANT_ID = accessibleTenants.data[0].id
        this.logStatus(
          ux.colorize('green', `${STATUS.OK} Found single accessible Tenant. Using ${process.env.TENANT_ID}.`),
        )
      } else {
        this.logStatus(
          ux.colorize(
            'cyan',
            `Your credentials can access tenants:\n${accessibleTenants.data.map((x) => `- ${x.attributes.name}: ${x.id}`).join(',\n')}.\n`,
          ),
        )
        tenantIdPrompted = true
      }
    }

    const tenantId =
      process.env.TENANT_ID ?? (await validatedInput({message: 'Enter your tenantID.'}, ValidationType.UUID))
    process.env.TENANT_ID = tenantId
    if (tenantIdPrompted) {
      this.logStatus(
        ux.colorize(
          'cyan',
          `${STATUS.TIP} export TENANT_ID=${tenantId} (Windows: set TENANT_ID=${tenantId}) to avoid inputting this for each command.\n`,
        ),
      )
    }

    try {
      await isTenantAdmin(tenantId, userId)
      this.logStatus(ux.colorize('green', `${STATUS.OK} Tenant Admin role confirmed.`))
    } catch (error) {
      this.debug(error)
      if (error instanceof ApiError || error instanceof NetworkError) {
        this.error(error.message)
      } else {
        this.error(
          `This tool requires Tenant Admin role. Please use a Tenant level Admin account or upgrade your account to be Tenant Admin.`,
        )
      }
    }

    let orgId
    let installId
    let clientId
    let clientSecret
    const discovered = await this.discoverInstallFromTenant(tenantId)
    if (discovered) {
      installId = discovered.installId
      orgId = discovered.appInstalledOnOrgId
      this.logStatus(ux.colorize('cyan', `Found existing Broker App Install ${installId} configured in this Tenant.`))
    } else {
      orgId = await validatedInput(
        {message: `Enter Org ID to install Broker App. Must be in Tenant ${tenantId}`},
        ValidationType.UUID,
      )
      const appInstall = await installAppsWorfklow(orgId)
      const {install_id, client_id, client_secret} = appInstall
      installId = install_id
      clientId = client_id
      if (!client_secret) {
        this.logStatus(ux.colorize('cyan', `Found an App already installed. Using Install ID ${installId}.`))
      } else {
        clientSecret = client_secret
        this.logStatus(ux.colorize('cyan', `\n${STATUS.IMPORTANT}`))
        this.logStatus(ux.colorize('cyan', `App installed. Please store the following credentials securely:`))
        this.logStatus(ux.colorize('cyan', `- clientId: ${client_id}`))
        this.logStatus(ux.colorize('cyan', `- clientSecret: ${client_secret}`))
        this.logStatus(ux.colorize('cyan', `You will need them to run your Broker Client.\n`))
        while (!(await confirm({message: 'Have you saved these credentials?'}))) {
          this.logStatus(
            ux.colorize(
              'yellow',
              `${STATUS.WARN} The client secret will never be visible again. Please save them securely.`,
            ),
          )
        }
        if (!(await confirm({message: `Continue?`}))) {
          process.exit(0)
        }
      }
    }

    if (skipOrgId) {
      orgId = 'dummy'
    }
    const appInstalledOnOrgId = orgId
    return {installId, tenantId, appInstalledOnOrgId, clientId, clientSecret}
  }

  async discoverInstallFromTenant(
    tenantId: string,
  ): Promise<{installId: string; appInstalledOnOrgId: string} | undefined> {
    const deployments = await getDeploymentsForTenant(tenantId)
    if (!deployments.data || deployments.data.length === 0) {
      return undefined
    }
    // dedupe the deployments down to the distinct installs.
    const installs = new Map<string, string>()
    for (const deployment of deployments.data) {
      if (!installs.has(deployment.attributes.install_id)) {
        installs.set(deployment.attributes.install_id, deployment.attributes.broker_app_installed_in_org_id)
      }
    }
    const newInstall = 'install-on-new-org'
    const choice = await select({
      message: 'Which Broker App Install do you want to use?',
      choices: [
        ...[...installs.entries()].map(([installId, orgId]) => ({
          name: `Install ${installId} (Org ${orgId})`,
          value: installId,
        })),
        {name: 'Create a new Broker App Install on a different Org', value: newInstall},
      ],
    })
    if (choice === newInstall) {
      return undefined
    }
    const appInstalledOnOrgId = installs.get(choice)
    if (!appInstalledOnOrgId) {
      return undefined
    }
    return {installId: choice, appInstalledOnOrgId}
  }

  async selectDeployment(tenantId: string, installId: string): Promise<DeploymentId> {
    const deployments = await getDeployments(tenantId, installId)
    let deploymentId
    if (deployments.errors) {
      this.logStatus(`${deployments.errors[0].detail}`)
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
      this.logStatus(`${deployments.errors[0].detail}`)
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
    // Return type is now ConnectionResponseData via ConnectionSelection
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
    const selectedConnectionData = existingConnections.data.find((x) => x.id === selectedConnection)
    if (!selectedConnectionData) {
      // This should ideally not happen if the select prompt worked correctly
      throw new Error(`Selected connection with ID ${selectedConnection} not found in the fetched list.`)
    }
    return {
      id: selectedConnectionData.id,
      name: selectedConnectionData.attributes.name,
      type: selectedConnectionData.attributes.configuration.type,
    }
  }

  async selectContext(tenantID: TenantId, installId: InstallId, deploymentId: DeploymentId): Promise<ContextSelection> {
    const existingContexts = await getContextsForForDeployment(tenantID, installId, deploymentId)
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
