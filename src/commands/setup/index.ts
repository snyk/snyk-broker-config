import {ux} from '@oclif/core'
import {commonApiRelatedArgs} from '../../common/args.js'
import {confirm, select} from '@inquirer/prompts'
import {BaseCommand} from '../../base-command.js'
import {connectionTypes} from '../../command-helpers/connections/type-params-mapping.js'
import {createIntegrationForConnection} from '../../api/integrations.js'
import {getExistingAppInstalledOnOrgId, replaceClientSecret} from '../../api/apps.js'
import {validatedInput, ValidationType} from '../../utils/input-validation.js'
import {STATUS} from '../../utils/display.js'
import {getConfig} from '../../config/config.js'

interface ConnectionSummary {
  connectionId: string
  connectionName: string
  connectionType: string
  integratedOrgs: string[]
}

// The Broker Client connects to a broker.* host in the same region as the tenant API.
const brokerServerUrl = () => getConfig().API_HOSTNAME.replace('//api.', '//broker.')

export default class Setup extends BaseCommand<typeof Setup> {
  public static enableJsonFlag = true
  static args = {
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - Guided end-to-end provisioning'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run() {
    try {
      this.heading(Setup.description)

      const {installId, tenantId, appInstalledOnOrgId, clientId, clientSecret} = await this.setupFlow()
      this.logStatus(ux.colorize('cyan', `Now using Tenant ID ${tenantId} and Install ID ${installId}.\n`))

      // setupFlow surfaces client_id only when it resolved the install from an Org ID.
      // When entered via the INSTALL_ID env override it won't have it, so recover it
      // here from the org the install lives in.
      let resolvedClientId = clientId
      if (!resolvedClientId) {
        const install = await getExistingAppInstalledOnOrgId(appInstalledOnOrgId)
        resolvedClientId = install?.attributes.client_id
      }

      // A fresh secret is only issued on a brand-new install. On resume the existing
      // secret can't be re-displayed, so offer to rotate it.
      let resolvedClientSecret = clientSecret
      if (!resolvedClientSecret && resolvedClientId) {
        resolvedClientSecret = await this.revokeAndRegenerateClientSecret(
          installId,
          resolvedClientId,
          appInstalledOnOrgId,
        )
      }

      const deploymentId = await this.setupOrSelectDeployment(tenantId, installId, appInstalledOnOrgId)
      this.logStatus(ux.colorize('cyan', `Now using Deployment ${deploymentId}.\n`))

      this.logStatus(
        ux.colorize(
          'cyan',
          `${STATUS.TIP} You can use a credentials reference for any field by simply entering the creds ref UUID. Use workflows credentials create|get to create|list available credentials reference(s).\n`,
        ),
      )

      const connections: ConnectionSummary[] = []
      while (
        await confirm({
          message: connections.length === 0 ? 'Create a Connection now?' : 'Add another Connection?',
        })
      ) {
        const connectionType = await select({
          message: 'Which Connection type do you want to create?',
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
        this.logStatus(ux.colorize('cyan', `Let's create a ${connectionType} Connection now.\n`))

        const {id: connectionId, name: connectionName} = await this.createNewConnection(
          tenantId,
          installId,
          deploymentId,
          connectionType,
        )
        this.logStatus(ux.colorize('cyan', `Connection created with ID ${connectionId}.\n`))

        const integratedOrgs = (await confirm({message: 'Integrate this Connection with an Org now?'}))
          ? await this.integrateConnection(tenantId, connectionId, connectionType)
          : []

        connections.push({connectionId, connectionName, connectionType, integratedOrgs})
      }

      this.printSummary(deploymentId, connections, resolvedClientId, resolvedClientSecret)

      return {
        DEPLOYMENT_ID: deploymentId,
        BROKER_SERVER_URL: brokerServerUrl(),
        ...(resolvedClientId ? {CLIENT_ID: resolvedClientId} : {}),
        ...(resolvedClientSecret ? {CLIENT_SECRET: resolvedClientSecret} : {}),
        connections,
      }
    } catch (error: any) {
      if (error.name === 'ExitPromptError') {
        this.logStatus('Goodbye.')
      } else {
        // Handle other errors or rethrow
        throw error
      }
    }
  }

  private async integrateConnection(tenantId: string, connectionId: string, connectionType: string): Promise<string[]> {
    const integratedOrgs: string[] = []
    do {
      const orgId = await validatedInput({message: 'Enter the OrgID to integrate.'}, ValidationType.UUID)
      const integration = await createIntegrationForConnection(tenantId, connectionId, connectionType, orgId)
      if (integration.errors) {
        this.logStatus(
          ux.colorize(
            'yellow',
            `${STATUS.WARN} Integration failed for Org ${orgId}: ${JSON.stringify(integration.errors)}`,
          ),
        )
      } else {
        integratedOrgs.push(orgId)
        this.logStatus(
          ux.colorize(
            'cyan',
            `Connection ${connectionId} (type: ${connectionType}) integrated with integration ${integration.data.id} on Org ${orgId}.\n`,
          ),
        )
      }
    } while (await confirm({message: 'Integrate with another Org?'}))
    return integratedOrgs
  }

  private async revokeAndRegenerateClientSecret(
    installId: string,
    clientId: string,
    appInstalledOnOrgId: string,
  ): Promise<string | undefined> {
    this.logStatus(ux.colorize('cyan', `Client ID: ${clientId}`))
    if (
      !(await confirm({
        message: `Need a new client secret? This will immediately deactivate your current secret. Active Broker clients will stop working until updated.`,
      }))
    ) {
      return undefined
    }
    const clientSecret = await replaceClientSecret(appInstalledOnOrgId, installId)
    this.logStatus(ux.colorize('cyan', `\n${STATUS.IMPORTANT}`))
    this.logStatus(ux.colorize('cyan', `New client secret issued. Please store it securely:`))
    this.logStatus(ux.colorize('cyan', `- clientSecret: ${clientSecret}`))
    while (!(await confirm({message: 'Have you saved the client secret?'}))) {
      this.logStatus(
        ux.colorize('yellow', `${STATUS.WARN} The client secret cannot be retrieved. Please save it securely.`),
      )
    }
    return clientSecret
  }

  private printSummary(
    deploymentId: string,
    connections: ConnectionSummary[],
    clientId?: string,
    clientSecret?: string,
  ): void {
    this.logStatus(ux.colorize('green', `\n${STATUS.DONE} Universal broker provisioned.\n`))

    // Recap of everything created this session.
    if (connections.length === 0) {
      this.logStatus(
        ux.colorize('cyan', `No Connections created this session — run "workflows connections create" to add one.`),
      )
    } else {
      this.logStatus(ux.colorize('cyan', `Connections:`))
      for (const connection of connections) {
        const orgs =
          connection.integratedOrgs.length > 0
            ? `orgs:[${connection.integratedOrgs.join(', ')}]`
            : 'no integrations configured this session'
        this.logStatus(
          ux.colorize(
            'cyan',
            `  - ${connection.connectionName} (${connection.connectionType}) — ${connection.connectionId}  ${orgs}`,
          ),
        )
        this.logStatus(
          ux.colorize(
            'cyan',
            `${STATUS.IMPORTANT}: Be sure to add any relevant credentials to your deployed Broker Client environment.`,
          ),
        )
      }
    }

    this.logStatus(
      ux.colorize(
        'cyan',
        `\n${STATUS.IMPORTANT}: This workflow provisions resources on the broker server-side. You still need to deploy and run your Broker Client with the valid configuration.`,
      ),
    )

    // The four values the Broker Client needs to run, rendered as shell exports and as a config file.
    const vars = [
      {key: 'DEPLOYMENT_ID', value: deploymentId},
      {key: 'BROKER_SERVER_URL', value: brokerServerUrl()},
      {key: 'CLIENT_ID', value: clientId, placeholder: 'find in your Snyk App install settings'},
      {
        key: 'CLIENT_SECRET',
        value: clientSecret,
        placeholder: 'not generated this session',
      },
    ]
    const line = (prefix: string, v: (typeof vars)[number]) =>
      v.value ? `${prefix}${v.key}=${v.value}` : `# ${prefix}${v.key}=<${v.placeholder}>`

    this.logStatus(`\nRun your Broker Client with:`)
    this.logStatus(`  Linux/Mac:`)
    for (const v of vars) {
      this.logStatus(`    ${line('export ', v)}`)
    }
    this.logStatus(`  Windows:`)
    for (const v of vars) {
      this.logStatus(`    ${line('set ', v)}`)
    }

    this.logStatus(`\nOr add these values to a configuration file:`)
    for (const v of vars) {
      this.logStatus(`  ${line('', v)}`)
    }

    if (!clientId) {
      this.logStatus(
        ux.colorize(
          'yellow',
          `\n${STATUS.WARN} CLIENT_ID could not be retrieved — find it in your Snyk App install settings.`,
        ),
      )
    }
    if (clientSecret) {
      this.logStatus(
        ux.colorize('yellow', `\n${STATUS.WARN} Save the client secret now — it is not retrievable later.`),
      )
    } else {
      this.logStatus(
        ux.colorize(
          'cyan',
          `\n${STATUS.TIP} The client secret was shown once at install time — re-run setup to regenerate it.`,
        ),
      )
    }
    this.logStatus(ux.colorize('cyan', `\nDocs: https://docs.snyk.io/enterprise-setup/snyk-broker/universal-broker`))
  }
}
