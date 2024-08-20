import {Command} from '@oclif/core'
import {commonUniversalBrokerArgs, commonUniversalBrokerDeploymentId, getCommonIds} from '../../common/args.js'
import {updateDeployment} from '../../api/deployments.js'
import {deploymentMetadata} from '../../command-helpers/deployments/flags.js'
import {printFormattedJSON} from '../../utils/display.js'

export default class Deployments extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
  }

  static flags = {
    ...deploymentMetadata,
  }

  static description = 'Universal Broker Deployments - Update operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID --data mykey=myvalue,mykey2=myvalue2`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID --data mykey=myvalue,mykey2=myvalue2`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds({tenantId: args.tenantId, installId: args.installId})
    const dataValues = flags.data.split(',').map((x) => {
      const dataSplit = x.split('=')
      return {[dataSplit[0]]: dataSplit[1]}
    })

    const attributes: Record<string, string> = {}
    for (const dataValue of dataValues) {
      for (const key in dataValue) {
        if (dataValue[key]) {
          attributes[key] = dataValue[key]
        }
      }
    }

    const deployment = await updateDeployment(tenantId, installId, args.deploymentId!, attributes)
    const deploymentResponse = JSON.parse(deployment).data as Array<any>
    if (this.jsonEnabled()) {
      console.log(JSON.stringify(deploymentResponse))
    } else {
      this.log(`Updated Universal Broker Deployment for Tenant ${tenantId}, Install ${installId}`)
      printFormattedJSON(deploymentResponse)
    }
  }
}
