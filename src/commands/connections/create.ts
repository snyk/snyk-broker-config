import {Command} from '@oclif/core'
import {
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  commonApiRelatedArgs,
  getCommonIds,
} from '../../common/args.js'
import {printFormattedJSON} from '../../utils/display.js'
import {connectionsData} from './flags.js'
import {createConnectionForDeployment} from '../../api/connections.js'

export default class Connections extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonApiRelatedArgs,
  }

  static flags = {
    ...connectionsData,
  }

  static description = 'Universal Broker Connections - Create operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID --type github`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID --type github`,
  ]

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Connections)

    const {tenantId, installId} = getCommonIds(args)

    const attributes = structuredClone(flags) as Omit<typeof flags, 'name' | 'type'>
    delete attributes.name
    delete attributes.type
    const connection = await createConnectionForDeployment(
      tenantId,
      installId,
      args.deploymentId,
      flags.name,
      flags.type,
      attributes,
    )
    const connectionResponse = JSON.parse(connection).data
    if (this.jsonEnabled()) {
      console.log(JSON.stringify(connectionResponse))
    } else {
      this.log(
        `Creating Universal Broker Connection for Deployment ${args.deploymentId} for Tenant ${tenantId}, Install ${installId}`,
      )
      printFormattedJSON(connectionResponse)
    }
  }
}
