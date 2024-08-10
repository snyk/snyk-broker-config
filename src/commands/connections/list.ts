import {Args, Command, Flags} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {getCredentialsForDeployment} from '../../api/credentials.js'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  getCommonIds,
} from '../../common/args.js'
import {getConnectionsForDeployment} from '../../api/connections.js'

export default class Deployments extends Command {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Connections - List operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<void> {
    const {args} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds(args)
    const connections = await getConnectionsForDeployment(tenantId, installId, args.deploymentId!)
    const connectionsList = JSON.parse(connections).data as Array<any>
    if (this.jsonEnabled()) {
      console.log(JSON.stringify(connectionsList))
    } else {
      this.log(
        `Getting Universal Broker Connections for Deployment ${args.deploymentId}, Tenant ${tenantId}, Install ${installId}`,
      )

      for (const connection of connectionsList) {
        printFormattedJSON(connection)
      }
      console.log(`Total = ${connectionsList.length}`)
    }
  }
}
