import {Args, Command, Flags} from '@oclif/core'

export default class Deployments extends Command {
  static args = {
    tenantId: Args.string({description: 'Tenant ID', required: true}),
    installId: Args.string({description: 'Install ID', required: true}),
    deploymentId: Args.string({description: 'Deployment ID', required: true}),
    apiUrl: Args.string({description: 'API Url', required: false, default: 'https://api.snyk.io'}),
    apiVersion: Args.string({description: 'API Version', required: false, default: '2024-07-18~experimental'}),
  }

  static description = 'Universal Broker Deployments - Update operation'

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

    this.log(`Updating Universal Broker Deployment ${args.deploymentId} for Tenant ${args.tenantId}, Install ${args.installId}`)
  }
}
