import {Command} from '@oclif/core'
import {commonApiRelatedArgs, commonUniversalBrokerArgs, getCommonIds} from '../../common/args.js'
import {printFormattedJSON} from '../../utils/display.js'
import {createDeployment} from '../../api/deployments.js'
import {deploymentMetadata} from '../../command-helpers/deployments/flags.js'

export default class Deployments extends Command {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonApiRelatedArgs,
  }

  static flags = {
    ...deploymentMetadata,
  }

  static description = 'Universal Broker Deployments - Create operation'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> --data mykey=myvalue,mykey2=myvalue2`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID --data mykey=myvalue,mykey2=myvalue2`,
  ]

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Deployments)
    const {tenantId, installId} = getCommonIds(args)
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
