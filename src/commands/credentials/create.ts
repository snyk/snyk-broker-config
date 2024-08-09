import {Args, Command, Flags} from '@oclif/core'
import {commonUniversalBrokerArgs, commonUniversalBrokerDeploymentId, commonApiRelatedArgs} from '../../common/args.js'

export default class Deployments extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Deployments - Create operation'

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

    this.log(`Creating Universal Broker Deployment for Tenant ${args.tenantId}, Install ${args.installId}`)
  }
}
