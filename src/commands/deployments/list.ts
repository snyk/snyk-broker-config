import {Command} from '@oclif/core'
import {commonApiRelatedArgs, commonUniversalBrokerArgs, getCommonIds} from '../../common/args.js'
import {getDeployments} from '../../api/deployments.js'
import {printFormattedJSON} from '../../utils/display.js'

export default class Deployments extends Command {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Deployments - List operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %>`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<void> {
    const {args} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds(args)
    const deployments = await getDeployments(tenantId, installId)
    const deploymentsList = JSON.parse(deployments).data as Array<any>
    if (this.jsonEnabled()) {
      console.log(JSON.stringify(deploymentsList))
    } else {
      this.log(`Getting Universal Broker Deployment for Tenant ${tenantId}, Install ${installId}`)

      for (const deployment of deploymentsList) {
        printFormattedJSON(deployment)
      }
      console.log(`Total = ${deploymentsList.length}`)
    }
  }
}
