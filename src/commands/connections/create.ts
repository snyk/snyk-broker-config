import {Args, Command, Flags} from '@oclif/core'
import {
  commonUniversalBrokerArgs,
  commonUniversalBrokerDeploymentId,
  commonApiRelatedArgs,
  getCommonIds,
} from '../../common/args.js'
import {printFormattedJSON} from '../../utils/display.js'
import {CredentialsAttributes, createCredentials} from '../../api/credentials.js'
import {connectionsData} from './flags.js'

export default class Deployments extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
    ...commonApiRelatedArgs,
  }

  static flags = {
    ...connectionsData,
    // ...AcrConfigurationConnectionsData
  }

  static description = 'Universal Broker Connections - Create operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID --type github`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID --type github`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Deployments)

    console.log(flags)
    const {tenantId, installId} = getCommonIds(args)
    // const attributes: CredentialsAttributes[] = []
    // const {comment, type, env_var_name} = flags
    // for (const envVarName of env_var_name.split(',')) {
    //   attributes.push({comment: comment, environment_variable_name: envVarName, type: type})
    // }

    // const deployment = await createCredentials(tenantId, installId, args.deploymentId, attributes)
    // const deploymentResponse = JSON.parse(deployment).data as Array<any>
    // if (this.jsonEnabled()) {
    //   console.log(JSON.stringify(deploymentResponse))
    // } else {
    //   this.log(
    //     `Creating Universal Broker Credentials for Deployment ${args.deploymentId} for Tenant ${tenantId}, Install ${installId}`,
    //   )
    //   printFormattedJSON(deploymentResponse)
    // }
  }
}
