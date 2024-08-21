import {ux} from '@oclif/core'
import {printFormattedJSON} from '../../utils/display.js'
import {getCredentialsForDeployment} from '../../api/credentials.js'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  getCommonIds,
} from '../../common/args.js'
import {BaseCommand} from '../../base-command.js'

export default class Credentials extends BaseCommand<typeof Credentials> {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker Deployments - List operation'

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
    this.log('\n' + ux.colorize('red', Credentials.description))
    const {args} = await this.parse(Credentials)
    const {tenantId, installId} = getCommonIds(args)
    const credentials = await getCredentialsForDeployment(tenantId, installId, args.deploymentId!)
    const credentialsList = JSON.parse(credentials).data as Array<any>

    this.log(
      ux.colorize(
        'cyan',
        `Getting Universal Broker Credentials for Deployment ${args.deploymentId}, Tenant ${tenantId}, Install ${installId}`,
      ),
    )

    for (const credential of credentialsList) {
      printFormattedJSON(credential)
    }
    this.log(`Total = ${credentialsList.length}`)

    return JSON.stringify(credentialsList)
  }
}
