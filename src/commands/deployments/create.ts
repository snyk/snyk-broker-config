import {Command} from '@oclif/core'
import {
  commonApiRelatedArgs,
  commonUniversalBrokerArgs,
  commonUniversalBrokerNewDeploymentArgs,
  getCommonIds,
} from '../../common/args.js'
import {printFormattedJSON} from '../../utils/display.js'
import {createDeployment} from '../../api/deployments.js'
import {deploymentMetadata} from '../../command-helpers/deployments/flags.js'

export default class Deployments extends Command {
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

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds(args)
    const metadataValues = flags.data.split(',').map((x) => {
      const dataSplit = x.split('=')
      return {[dataSplit[0]]: dataSplit[1]}
    })

    const attributes: Record<string, any> = {
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
    const deploymentResponse = JSON.parse(deployment).data as Array<any>
    if (this.jsonEnabled()) {
      console.log(JSON.stringify(deploymentResponse))
    } else {
      this.log(`Creating Universal Broker Deployment for Tenant ${tenantId}, Install ${installId}`)
      printFormattedJSON(deploymentResponse)
    }
  }
}
