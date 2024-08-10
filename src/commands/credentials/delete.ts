import {Args, Command, Flags} from '@oclif/core'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  getCommonIds,
} from '../../common/args.js'
import {credentialsIds} from './flags.js'
import {deleteCredentials} from '../../api/credentials.js'

export default class Deployments extends Command {
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

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds({tenantId: args.tenantId, installId: args.installId})
    const credentialsIdsArray = flags.credentialsIds.split(',')
    this.log(
      `Deleting Universal Broker Credentials for Deployment ${args.deploymentId}, Tenant ${tenantId}, Install ${installId}`,
    )

    for (const credentialsId of credentialsIdsArray) {
      const deleteResponseCode = await deleteCredentials(tenantId, installId, args.deploymentId!, credentialsId)
      if (deleteResponseCode === 204) {
        if (this.jsonEnabled()) {
          console.log(JSON.stringify({responseCode: deleteResponseCode}))
        } else {
          this.log(
            `Deleted Universal Broker Credentials ${credentialsId} in Deployment ${args.deploymentId} for Tenant ${tenantId}, Install ${installId}`,
          )
        }
      } else {
        this.error(`Error deleting credentials for deployment. Status code: ${deleteResponseCode}.`)
      }
    }
  }
}
