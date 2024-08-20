import {Command, ux} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerConnectionId,
  commonUniversalBrokerIntegrationsIds,
  getCommonIds,
} from '../../common/args.js'
import {deleteIntegrationsForConnection, getIntegrationsForConnection} from '../../api/integrations.js'

export default class Integrations extends Command {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerConnectionId(true),
    ...commonUniversalBrokerIntegrationsIds(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Connections Integrations - List operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> CONNECTION_ID ORG_ID INTEGRATION_ID`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID CONNECTION_ID ORG_ID INTEGRATION_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<string> {
    this.log('\n'+ux.colorize('red',Integrations.description))
    const {args} = await this.parse(Integrations)
    const {tenantId} = getCommonIds(args)
    const integrationsResponseCode = await deleteIntegrationsForConnection(
      tenantId,
      args.connectionId,
      args.orgId,
      args.integrationId,
    )
    if (integrationsResponseCode === 204) {
      this.log(
        ux.colorize('cyan',`Deleted Universal Broker Deployment for Tenant ${tenantId}, Connection ${args.connectionId}, Org ${args.orgId}, Integration ${args.integrationId}`,)
      )
      return JSON.stringify({responseCode: integrationsResponseCode})
    } else {
      this.error(ux.colorize('red',`Error deleting deployment. Status code: ${integrationsResponseCode}.`))
    }
  }
}
