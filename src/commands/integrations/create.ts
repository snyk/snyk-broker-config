import {ux} from '@oclif/core'
import {
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  commonApiRelatedArgs,
  getCommonIds,
  commonUniversalBrokerConnectionId,
  commonUniversalBrokerIntegrationsIds,
  commonUniversalBrokerIntegrationType,
} from '../../common/args.js'
import {printFormattedJSON} from '../../utils/display.js'
import {createIntegrationForConnection} from '../../api/integrations.js'
import {BaseCommand} from '../../base-command.js'

export default class Integrations extends BaseCommand<typeof Integrations> {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerConnectionId(true),
    ...commonUniversalBrokerIntegrationsIds(true),
    ...commonUniversalBrokerIntegrationType(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Connections - Create operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> CONNECTION_ID ORG_ID INTEGRATION_ID`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID CONNECTION_ID ORG_ID INTEGRATION_ID`,
  ]

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Integrations.description))
    const {args} = await this.parse(Integrations)

    const {tenantId} = getCommonIds(args)

    const integration = await createIntegrationForConnection(
      tenantId,
      args.connectionId,
      args.type,
      args.orgId,
      args.integrationId ?? null,
    )
    const integrationResponse = integration
    this.log(
      ux.colorize(
        'cyan',
        `Creating Universal Broker Integration for Connection ${args.connectionId} for Org ${args.orgId}, Integration ${args.integrationId}`,
      ),
    )
    this.log(printFormattedJSON(integrationResponse))

    return JSON.stringify(integrationResponse)
  }
}
