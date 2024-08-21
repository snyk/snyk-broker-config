import {ux} from '@oclif/core'
import {commonApiRelatedArgs, commonUniversalBrokerArgs, getCommonIds} from '../../common/args.js'
import {getDeployments} from '../../api/deployments.js'
import {printIndexedFormattedJSON} from '../../utils/display.js'
import {BaseCommand} from '../../base-command.js'

export default class Deployments extends BaseCommand<typeof Deployments> {
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

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Deployments.description))
    const {args} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds(args)
    const deployments = await getDeployments(tenantId, installId)
    const deploymentsList = deployments.data ?? []

    this.log(
      '=>',
      ux.colorize('cyan', `Getting Universal Broker Deployment for Tenant ${tenantId}, Install ${installId}`),
    )

    this.log(printIndexedFormattedJSON(deploymentsList))
    // for (const deployment of deploymentsList) {
    //   this.log(printFormattedJSON(deployment))
    // }
    this.log(ux.colorize('cyan', `Total = ${deploymentsList.length}`))

    return JSON.stringify(deploymentsList)
  }
}
