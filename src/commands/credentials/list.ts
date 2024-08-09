import {Args, Command, Flags} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {getCredentialsForDeployment} from '../../api/credentials.js'
import {commonApiRelatedArgs, commonUniversalBrokerArgs, commonUniversalBrokerDeploymentId} from '../../common/args.js'

export default class Deployments extends Command {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
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
    const credentials = await getCredentialsForDeployment(args.tenantId, args.installId, args.deploymentId!)
    const credentialsList = JSON.parse(credentials).data as Array<any>
    if (this.jsonEnabled()) {
      console.log(JSON.stringify(credentialsList))
    } else {
      this.log(`Getting Universal Broker Deployment for Tenant ${args.tenantId}, Install ${args.installId}`)

      for (let i = 0; i < credentialsList.length; i++) {
        printFormattedJSON(credentialsList[i])
      }
    }
  }
}
