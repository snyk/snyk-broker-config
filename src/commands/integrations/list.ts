import {Command} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerConnectionId,
  getCommonIds,
} from '../../common/args.js'
import {getConnectionsForDeployment} from '../../api/connections.js'
import {getIntegrationsForConnection} from '../../api/integrations.js'

export default class Integrations extends Command {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerConnectionId(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Connections Integrations - List operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> CONNECTION_ID`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID CONNECTION_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<void> {
    const {args} = await this.parse(Integrations)
    const {tenantId} = getCommonIds(args)
    const integrations = await getIntegrationsForConnection(tenantId, args.connectionId)
    const integrationsList = JSON.parse(integrations).data as Array<any>
    if (this.jsonEnabled()) {
      console.log(JSON.stringify(integrationsList))
    } else {
      this.log(
        `Getting Universal Broker Connections Integrations for Connection ${args.connectionId}, Tenant ${tenantId}`,
      )

      for (const connection of integrationsList) {
        printFormattedJSON(connection)
      }
      console.log(`Total = ${integrationsList.length}`)
    }
  }
}
