import {ux} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerConnectionId,
  getCommonIds,
} from '../../common/args.js'
import {getIntegrationsForConnection} from '../../api/integrations.js'
import {BaseCommand} from '../../base-command.js'

export default class Integrations extends BaseCommand<typeof Integrations> {
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

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Integrations.description))
    const {args} = await this.parse(Integrations)
    const {tenantId} = getCommonIds(args)
    const integrations = await getIntegrationsForConnection(tenantId, args.connectionId)
    const integrationsList = JSON.parse(integrations).data as Array<any>

    this.log(
      ux.colorize(
        'cyan',
        `Getting Universal Broker Connections Integrations for Connection ${args.connectionId}, Tenant ${tenantId}`,
      ),
    )

    for (const connection of integrationsList) {
      this.log(printFormattedJSON(connection))
    }
    this.log(ux.colorize('cyan', `Total = ${integrationsList.length}`))
    return JSON.stringify(integrationsList)
  }
}
