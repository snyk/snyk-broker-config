import {Command} from '@oclif/core'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerConnectionId,
  commonUniversalBrokerDeploymentId,
  getCommonIds,
} from '../../common/args.js'
import {deleteConnectionForDeployment, getConnectionsForDeployment} from '../../api/connections.js'

export default class Deployments extends Command {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonUniversalBrokerConnectionId(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Connections - Delete operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID CONNECTION_ID`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID CONNECTION_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<void> {
    const {args} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds(args)
    const deleteConnectionResponseCode = await deleteConnectionForDeployment(
      tenantId,
      installId,
      args.deploymentId!,
      args.connectionId,
    )
    if (deleteConnectionResponseCode === 204) {
      if (this.jsonEnabled()) {
        console.log(JSON.stringify({responseCode: deleteConnectionResponseCode}))
      } else {
        this.log(
          `Deleted Universal Broker Connection ${args.connectionId} for Tenant ${tenantId}, Install ${installId}`,
        )
      }
    } else {
      this.error(`Error deleting broker connection. Status code: ${deleteConnectionResponseCode}.`)
    }
  }
}
