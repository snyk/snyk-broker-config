import {Command, ux} from '@oclif/core'
import {
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  commonApiRelatedArgs,
  getCommonIds,
  commonUniversalBrokerConnectionId,
} from '../../common/args.js'
import {printFormattedJSON} from '../../utils/display.js'
import {updateConnectionsData} from '../../command-helpers/connections/flags.js'
import {getConnectionsForDeployment, updateConnectionForDeployment} from '../../api/connections.js'
import {convertCredsToUuid} from '../../api/credentials.js'

export default class Connections extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonUniversalBrokerConnectionId(true),
    ...commonApiRelatedArgs,
  }

  static flags = {
    ...updateConnectionsData,
  }

  static description = 'Universal Broker Connections - Update operation'

  static examples = [
    `[with exported TENANT_ID, INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID CONNECTION_ID --type github`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID CONNECTION_ID --type github`,
  ]

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Connections.description))
    const {args, flags} = await this.parse(Connections)

    const {tenantId, installId} = getCommonIds(args)

    const connections = await getConnectionsForDeployment(tenantId, installId, args.deploymentId)
    const existingConnection = connections.data.find((x) => x.id === args.connectionId)
    if (!existingConnection) {
      throw new Error(`Connection not found for deployment ${args.deploymentId} in tenant ${tenantId}`)
    }
    const existingAttributes = existingConnection.attributes.configuration.required as Record<string, string>
    const onlyCredentialsAttributes = Object.fromEntries(
      Object.entries(existingAttributes).filter(([_, value]) => /\${[^}]+}/.test(value)),
    )
    const credentialsUuid = await convertCredsToUuid(
      tenantId,
      installId,
      args.deploymentId,
      onlyCredentialsAttributes,
      flags.type,
    )

    const attributes = structuredClone(flags) as Omit<typeof flags, 'name' | 'type'>
    delete attributes.name
    delete attributes.type
    const connection = await updateConnectionForDeployment(
      tenantId,
      installId,
      args.deploymentId,
      args.connectionId,
      flags.name,
      flags.type,
      {...existingAttributes, ...credentialsUuid, ...attributes},
    )
    const connectionResponse = JSON.parse(connection).data

    this.log(
      ux.colorize(
        'cyan',
        `Updating Universal Broker Connections ${args.connectionId} for Deployment ${args.deploymentId} for Tenant ${tenantId}, Install ${installId}`,
      ),
    )
    this.log(printFormattedJSON(connectionResponse))
    return JSON.stringify(connectionResponse)
  }
}
