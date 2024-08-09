import {Args, Command, Flags} from '@oclif/core'
import {commonApiRelatedArgs, commonUniversalBrokerArgs} from '../../common/args.js'
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
    `<%= config.bin %> <%= command.id %> friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Deployments)
    const deployments = await getDeployments(args.tenantId, args.installId)
    const deploymentsList = JSON.parse(deployments).data as Array<any>
    if (this.jsonEnabled()) {
      console.log(JSON.stringify(deploymentsList))
    } else {
      this.log(`Getting Universal Broker Deployment for Tenant ${args.tenantId}, Install ${args.installId}`)

      for (let i = 0; i < deploymentsList.length; i++) {
        printFormattedJSON(deploymentsList[i])
      }
    }
  }
}
