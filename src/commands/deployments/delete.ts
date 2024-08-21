import {Command, ux} from '@oclif/core'
import {commonUniversalBrokerArgs, commonUniversalBrokerDeploymentId, getCommonIds} from '../../common/args.js'
import {deleteDeployment} from '../../api/deployments.js'

export default class Deployments extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
  }

  static description = 'Universal Broker Deployments - Delete operation'

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
    this.log('\n' + ux.colorize('red', Deployments.description))
    const {args} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds({tenantId: args.tenantId, installId: args.installId})
    this.log(
      ux.colorize(
        'cyan',
        `Deleting Universal Broker Deployment ${args.deploymentId} for Tenant ${tenantId}, Install ${installId}`,
      ),
    )

    const deploymentResponseCode = await deleteDeployment(tenantId, installId, args.deploymentId!)
    if (deploymentResponseCode === 204) {
      this.log(ux.colorize('cyan', `Deleted Universal Broker Deployment for Tenant ${tenantId}, Install ${installId}`))
      return JSON.stringify({responseCode: deploymentResponseCode})
    }
    this.error(ux.colorize('red', `Error deleting deployment. Status code: ${deploymentResponseCode}.`))
  }
}
