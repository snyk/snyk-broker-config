// src/baseCommand.ts
import {Command, Flags, Interfaces, ux} from '@oclif/core'
import {getConfig} from './config/config.js'
import {input, confirm, select} from '@inquirer/prompts'
import {getAppInstalledOnOrgId, getInstallIdsWithOrgIdForTenant, installAppsWorfklow} from './workflows/apps.js'
import {createDeployment, DeploymentAttributes, DeploymentResponse, getDeployments} from './api/deployments.js'
import {ConnectionId, ConnectionSelection, DeploymentId, InstallId, SetupParameters, TenantId} from './types.js'
import {getConnectionsForDeployment, createConnectionForDeployment} from './api/connections.js'
import {captureConnectionParams} from './command-helpers/connections/parameters-capture.js'
import {getAccessibleTenants, getTenantRole} from './api/tenants.js'
import {validatedInput, ValidationType} from './utils/input-validation.js'
import {validateSnykToken} from './api/snyk.js'
import {createNewOrg, getPossibleExistingBrokerAdminOrgs, validateSnykInstallId} from './api/orgs.js'
import {getGroupsForTenant} from './api/groups.js'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

const ORG_NAME = 'Snyk Broker Admin'

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
    const snykToken = process.env.SNYK_TOKEN ?? (await input({message: 'Enter your Snyk Token'}))
    process.env.SNYK_TOKEN = snykToken

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
            'yellow',
            `Your credentials can access tenants ${accessibleTenants.data.map((x) => `[${x.attributes.name}:${x.id}]`).join(',')}. Please set TENANT_ID for the tenant of your choice.`,
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

    let orgId: string
    let installId: string
    if (process.env.INSTALL_ID) {
      installId = process.env.INSTALL_ID
    }

    this.log(
      ux.colorize(
        'yellow',
        `Helpful tip ! Set TENANT_ID, INSTALL_ID as environment values to avoid pasting the values in for every command.`,
      ),
    )
    if (skipOrgId) {
      orgId = 'dummy'
    }

    const installsWithOrgs = await getInstallIdsWithOrgIdForTenant(tenantId, ORG_NAME)
    if (installsWithOrgs.length === 0) {
      const installedWorkflowResponse = await this.appInstallWorkflow(tenantId)
      installId = installedWorkflowResponse.installId
      orgId = installedWorkflowResponse.appInstalledOnOrgId
    } else if (installsWithOrgs.length > 1) {
      const choices = installsWithOrgs.map((x, index) => {
        return {
          id: index,
          value: x.installId,
          description: `Install ${x.installId} installed on org ${x.installedOrgId}. ${x.comment}.`,
        }
      })
      choices.push(
        {
          id: 998,
          value: 'Install new app',
          description: `Install a new app.`,
        },
        {
          id: 999,
          value: 'Enter your Install Id',
          description: `Enter install Id and Org Id.`,
        },
      )
      const selectedInstallId = await select({
        message: 'Which existing Install ID would like to use?',
        choices,
      })
      if (selectedInstallId === 'Enter your Install Id') {
        installId = await input({message: 'Enter your Install Id.'})
        orgId = await input({message: 'Enter your Org Id where installed.'})
        if (!(await validateSnykInstallId(installId, orgId))) {
          throw new Error(`Invalid install Id, not found installed in org ${orgId}.`)
        }
      } else if (selectedInstallId === 'Install new app') {
        const installedWorkflowResponse = await this.appInstallWorkflow(tenantId)
        installId = installedWorkflowResponse.installId
        orgId = installedWorkflowResponse.appInstalledOnOrgId
      } else {
        installId = selectedInstallId
        const installIndex = installsWithOrgs.findIndex((x) => x.installId === selectedInstallId)
        orgId = installsWithOrgs[installIndex].installedOrgId
      }
    } else {
      installId = installsWithOrgs[0].installId
      orgId = installsWithOrgs[0].installedOrgId
    }
    return {installId, tenantId, appInstalledOnOrgId: orgId}
  }

  async appInstallWorkflow(tenantId: TenantId): Promise<SetupParameters> {
    this.log(ux.colorize('yellow', `Installing Broker App.`))
    let installId
    let orgId
    let createBrokerAdminOrg
    let groupId
    const groups = await getGroupsForTenant()
    if (groups.data.length === 0) {
      this.log(
        ux.colorize(
          'orange',
          'No groups detected. Automatic install requires at least one group in tenant. Default to manual install.',
        ),
      )
      throw new Error(
        'Error installing Broker App: at least one group in your tenant is required. Please create a group and try again.',
      )
    } else {
      groupId =
        groups.data.length === 1
          ? groups.data[0].id
          : await select({
              message: 'Which group do you want to create Snyk Broker Admin org in?',
              choices: groups.data.map((x) => {
                return {id: x.id, value: x.id, description: `${x.attributes.name}`}
              }),
            })
    }
    const existingOrgIds = await getPossibleExistingBrokerAdminOrgs({name: ORG_NAME, groupId: groupId})
    if (existingOrgIds.length === 0) {
      createBrokerAdminOrg = await confirm({
        message:
          'Create dedicated organization and install Broker app? (recommended). Press N to enter your own org Id.',
        default: true,
      })
    } else {
      this.log(ux.colorize('red', `Snyk Broker Admin org already exist in group.`))
      throw new Error(
        `Error installing Broker App: Snyk Broker Admin org already exists in group ${groupId}. Either choose the corresponding install in the list or delete the ${ORG_NAME} organization and try again.`,
      )
    }

    if (createBrokerAdminOrg && groupId) {
      const createdOrg = await createNewOrg({name: ORG_NAME, groupId})
      orgId = createdOrg.id
      this.log(
        ux.colorize(
          'yellow',
          `Created org ${ORG_NAME} (${orgId}) in group ${groups.data.find((x) => x.id === groupId)?.attributes.name} (${groupId})`,
        ),
      )
    } else {
      orgId = await validatedInput(
        {message: `Enter Org ID to install Broker App. Must be in Tenant ${tenantId}`},
        ValidationType.UUID,
      )
    }

    const appInstall = await installAppsWorfklow(orgId)
    if (typeof appInstall === 'string') {
      this.log(ux.colorize('purple', `Found an App already installed. Using Install ID ${appInstall}.`))
      installId = appInstall
    } else {
      const {install_id, client_id, client_secret} = appInstall
      installId = install_id
      this.log(ux.colorize('purple', `App installed on org ${orgId}. Please store the following credentials securely:`))
      this.log(ux.colorize('purple', `- clientId: ${client_id}`))
      this.log(ux.colorize('purple', `- clientSecret: ${client_secret}`))
      this.log(ux.colorize('purple', `You will need them to run your Broker Client.`))
      while (!(await confirm({message: 'Have you saved these credentials?'}))) {
        this.log(ux.colorize('red', 'The client secret will never be visible again. Please save them securely.'))
      }
    }
    return {appInstalledOnOrgId: orgId, installId: installId, tenantId}
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
