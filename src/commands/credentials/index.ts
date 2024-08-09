import {Args, Command, Flags} from '@oclif/core'
import {commonUniversalBrokerArgs, commonUniversalBrokerDeploymentId} from '../../common/args.js'

export default class Credentials extends Command {
  static args = {
    ...commonUniversalBrokerArgs,
    ...commonUniversalBrokerDeploymentId(true),
  }

  static description = 'Universal Broker Deployments - CRUD operations'

  static examples = [
    `<%= config.bin %> <%= command.id %> friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Credentials)

    this.log(`Getting Universal Broker Deployment Credentials for Deployment Id ${args.deploymentId}`)
  }
}
