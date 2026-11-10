import {ux} from '@oclif/core'
import {
  commonUniversalBrokerArgs,
  commonApiRelatedArgs,
  getCommonIds,
  commonUniversalBrokerConnectionId,
  commonUniversalBrokerIntegrationsIds,
  commonUniversalBrokerIntegrationType,
} from '../../common/args.js'
import {printFormattedJSON} from '../../utils/display.js'
import {createIntegrationForConnection} from '../../api/integrations.js'
import {BaseCommand} from '../../base-command.js'
import {isMissingRequiredIntegrationId} from '../../command-helpers/connections/multiple-profiles.js'

export default class Integrations extends BaseCommand<typeof Integrations> {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerConnectionId(true),
    ...commonUniversalBrokerIntegrationsIds(true),
    ...commonUniversalBrokerIntegrationType(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Connections Integrations - Create operation'

  static examples = [
    `[with exported TENANT_ID, INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> CONNECTION_ID ORG_ID INTEGRATION_ID`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID CONNECTION_ID ORG_ID INTEGRATION_ID`,
  ]

  async run() {
    this.heading(Integrations.description)
    const {args} = await this.parse(Integrations)

    const {tenantId} = getCommonIds(args)

    if (isMissingRequiredIntegrationId(args.type, args.integrationId)) {
      this.error(
        `Connection type "${args.type}" supports multiple profiles, so a valid INTEGRATIONID (UUID) of an existing Integration (profile) is required. Create the profile in Snyk first, then pass its ID.`,
      )
    }

    const integration = await createIntegrationForConnection(
      tenantId,
      args.connectionId,
      args.type,
      args.orgId,
      args.integrationId ?? null,
    )
    const integrationResponse = integration
    this.logStatus(
      ux.colorize(
        'cyan',
        `Creating Universal Broker Connections Integration for Connection ${args.connectionId} for Org ${args.orgId}, Integration ${args.integrationId}, Tenant ${tenantId},`,
      ),
    )
    this.log(printFormattedJSON(integrationResponse))

    return integrationResponse
  }
}
