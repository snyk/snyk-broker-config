import {ux} from '@oclif/core'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerConnectionId,
  commonUniversalBrokerIntegrationsIds,
  getCommonIds,
} from '../../common/args.js'
import {deleteIntegrationsForConnection} from '../../api/integrations.js'
import {BaseCommand} from '../../base-command.js'
import {STATUS} from '../../utils/display.js'

export default class Integrations extends BaseCommand<typeof Integrations> {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerConnectionId(true),
    ...commonUniversalBrokerIntegrationsIds(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Connections Integrations - Delete operation'

  static examples = [
    `[with exported TENANT_ID, INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> CONNECTION_ID ORG_ID INTEGRATION_ID`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID CONNECTION_ID ORG_ID INTEGRATION_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run() {
    this.heading(Integrations.description)
    const {args} = await this.parse(Integrations)
    const {tenantId} = getCommonIds(args)
    const integrationsResponseCode = await deleteIntegrationsForConnection(
      tenantId,
      args.connectionId,
      args.orgId,
      args.integrationId,
    )
    if (integrationsResponseCode === 204) {
      this.logStatus(
        ux.colorize(
          'green',
          `${STATUS.DONE} Deleted Universal Broker Connections Integration for Connection ${args.connectionId} for Org ${args.orgId}, Integration ${args.integrationId}, Tenant ${tenantId}`,
        ),
      )
      return {responseCode: integrationsResponseCode}
    }
    this.error(`Error deleting Deployment. Status code: ${integrationsResponseCode}.`)
  }
}
