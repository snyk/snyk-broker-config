import {Args, Command, Flags} from '@oclif/core'
import {commonUniversalBrokerArgs, commonUniversalBrokerDeploymentId} from '../../common/args.js'

export default class Deployments extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
  }

  static description = 'Universal Broker Deployments - Delete operation'

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

    this.log(
      `Deleting Universal Broker Deployment ${args.deploymentId} for Tenant ${args.tenantId}, Install ${args.installId}`,
    )
  }
}
