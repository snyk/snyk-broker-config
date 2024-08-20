import {Args, Command, Flags, ux} from '@oclif/core'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  getCommonIds,
} from '../../common/args.js'
import {credentialsIds} from '../../command-helpers/credentials/flags.js'
import {deleteCredentials} from '../../api/credentials.js'

export default class Credentials extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonApiRelatedArgs,
  }

  static flags = {
    ...credentialsIds,
  }

  static description = 'Universal Broker Deployment Credentials - Delete operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID -c CREDENTIALS_ID`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID -c CREDENTIALS_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<string> {
    this.log('\n'+ux.colorize('red',Credentials.description))
    const {args, flags} = await this.parse(Credentials)
    const {tenantId, installId} = getCommonIds({tenantId: args.tenantId, installId: args.installId})
    const credentialsIdsArray = flags.credentialsIds.split(',')
    this.log(
      `Deleting Universal Broker Credentials for Deployment ${args.deploymentId}, Tenant ${tenantId}, Install ${installId}`,
    )
    const jsonResponse = []
    for (const credentialsId of credentialsIdsArray) {
      const deleteResponseCode = await deleteCredentials(tenantId, installId, args.deploymentId!, credentialsId)
      if (deleteResponseCode === 204) {
        jsonResponse.push({responseCode: deleteResponseCode})

        this.log(
          ux.colorize('cyan',`Deleted Universal Broker Credentials ${credentialsId} in Deployment ${args.deploymentId} for Tenant ${tenantId}, Install ${installId}`,)
        )
      } else {
        this.error(ux.colorize('red',`Error deleting credentials for deployment. Status code: ${deleteResponseCode}.`))
      }
    }
    return JSON.stringify(jsonResponse)
  }
}
