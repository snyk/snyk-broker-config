import {ux} from '@oclif/core'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerNewDeploymentArgs,
  getCommonIds,
} from '../../common/args.js'
import {printFormattedJSON} from '../../utils/display.js'
import {createDeployment, DeploymentAttributes} from '../../api/deployments.js'
import {deploymentMetadata} from '../../command-helpers/deployments/flags.js'
import {BaseCommand} from '../../base-command.js'

export default class Deployments extends BaseCommand<typeof Deployments> {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerNewDeploymentArgs,
    ...commonApiRelatedArgs,
  }

  static flags = {
    ...deploymentMetadata,
  }

  static description = 'Universal Broker Deployments - Create operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> APP_INSTALLED_ORG_ID --data mykey=myvalue,mykey2=myvalue2`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID APP_INSTALLED_ORG_ID --data mykey=myvalue,mykey2=myvalue2`,
  ]

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Deployments.description))
    const {args, flags} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds(args)
    const metadataValues = flags.data.split(',').map((x) => {
      const dataSplit = x.split('=')
      return {[dataSplit[0]]: dataSplit[1]}
    })

    const attributes: DeploymentAttributes = {
      broker_app_installed_in_org_id: args.appInstalledInOrgId,
      metadata: {},
    }
    for (const dataValue of metadataValues) {
      for (const key in dataValue) {
        if (dataValue[key]) {
          attributes.metadata[key] = dataValue[key]
        }
      }
    }

    const deployment = await createDeployment(tenantId, installId, attributes)

    this.log(ux.colorize('cyan', `Creating Universal Broker Deployment for Tenant ${tenantId}, Install ${installId}`))
    this.log(printFormattedJSON(deployment.data))
    return JSON.stringify(deployment)
  }
}
