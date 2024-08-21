import {ux} from '@oclif/core'
import {
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  commonApiRelatedArgs,
  getCommonIds,
} from '../../common/args.js'
import {credentialId, credentialsData} from '../../command-helpers/credentials/flags.js'
import {printFormattedJSON} from '../../utils/display.js'
import {CredentialsAttributes, updateCredentials} from '../../api/credentials.js'
import {BaseCommand} from '../../base-command.js'

export default class Credentials extends BaseCommand<typeof Credentials> {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonApiRelatedArgs,
  }

  static flags = {
    ...credentialId,
    ...credentialsData,
  }

  static description = 'Universal Broker Credentials - Update operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID --credentialsId CREDENTIALID--comment "mycomment" --env_var_name MY_GITHUB_TOKEN --type github`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID --credentialsId CREDENTIALID --comment "mycomment" --env_var_name MY_GITHUB_TOKEN --type github`,
  ]

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Credentials.description))
    const {args, flags} = await this.parse(Credentials)
    const {tenantId, installId} = getCommonIds(args)

    const attributes: CredentialsAttributes = {
      comment: flags.comment,
      environment_variable_name: flags.env_var_name,
      type: flags.type,
    }

    const deployment = await updateCredentials(tenantId, installId, args.deploymentId, flags.credentialsId, attributes)
    const deploymentResponse = JSON.parse(deployment).data as Array<any>

    this.log(
      ux.colorize(
        'cyan',
        `Updating Universal Broker Credentials ${flags.credentialsId} for Deployment ${args.deploymentId} for Tenant ${tenantId}, Install ${installId}`,
      ),
    )
    this.log(printFormattedJSON(deploymentResponse))
    return JSON.stringify(deploymentResponse)
  }
}
