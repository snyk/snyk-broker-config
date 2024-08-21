import {ux} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  getCommonIds,
} from '../../common/args.js'
import {getConnectionsForDeployment} from '../../api/connections.js'
import {BaseCommand} from '../../base-command.js'

export default class Connections extends BaseCommand<typeof Connections> {
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

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Connections.description))
    const {args} = await this.parse(Connections)
    const {tenantId, installId} = getCommonIds(args)
    const connections = await getConnectionsForDeployment(tenantId, installId, args.deploymentId!)
    const connectionsList = JSON.parse(connections).data as Array<any>

    this.log(
      ux.colorize(
        'cyan',
        `Getting Universal Broker Connections for Deployment ${args.deploymentId}, Tenant ${tenantId}, Install ${installId}`,
      ),
    )

    for (const connection of connectionsList) {
      this.log(printFormattedJSON(connection))
    }
    this.log(`Total = ${connectionsList.length}`)

    return JSON.stringify(connectionsList)
  }
}
