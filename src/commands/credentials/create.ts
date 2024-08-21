import {ux} from '@oclif/core'
import {
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  commonApiRelatedArgs,
  getCommonIds,
} from '../../common/args.js'
import {credentialsData} from '../../command-helpers/credentials/flags.js'
import {printFormattedJSON} from '../../utils/display.js'
import {CredentialsAttributes, createCredentials} from '../../api/credentials.js'
import {BaseCommand} from '../../base-command.js'

export default class Credentials extends BaseCommand<typeof Credentials> {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonApiRelatedArgs,
  }

  static flags = {
    ...credentialsData,
  }

  static description = 'Universal Broker Credentials - Create operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID --comment "mycomment" --env_var_name MY_GITHUB_TOKEN --type github`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID --comment "mycomment" --env_var_name MY_GITHUB_TOKEN --type github`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Credentials.description))
    const {args, flags} = await this.parse(Credentials)
    const {tenantId, installId} = getCommonIds(args)

    const attributes: CredentialsAttributes[] = []
    const {comment, type, env_var_name} = flags
    for (const envVarName of env_var_name.split(',')) {
      attributes.push({comment: comment, environment_variable_name: envVarName, type: type})
    }

    const deployment = await createCredentials(tenantId, installId, args.deploymentId, attributes)
    const deploymentResponse = JSON.parse(deployment).data as Array<any>
    this.log(
      ux.colorize(
        'cyan',
        `Creating Universal Broker Credentials for Deployment ${args.deploymentId} for Tenant ${tenantId}, Install ${installId}`,
      ),
    )
    this.log(printFormattedJSON(deploymentResponse))
    return JSON.stringify(deploymentResponse)
  }
}
