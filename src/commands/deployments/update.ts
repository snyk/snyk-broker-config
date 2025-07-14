import {ux} from '@oclif/core'
import {commonUniversalBrokerArgs, commonUniversalBrokerDeploymentId, getCommonIds} from '../../common/args.js'
import {getDeployments, updateDeployment} from '../../api/deployments.js'
import {deploymentMetadata} from '../../command-helpers/deployments/flags.js'
import {printFormattedJSON} from '../../utils/display.js'
import {BaseCommand} from '../../base-command.js'

export default class Deployments extends BaseCommand<typeof Deployments> {
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonUniversalBrokerDeploymentId(true),
  }

  static flags = {
    ...deploymentMetadata,
  }

  static description = 'Universal Broker Deployments - Update operation'

  static examples = [
    `[with exported TENANT_ID, INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> DEPLOYMENT_ID --data mykey=myvalue,mykey2=myvalue2`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID DEPLOYMENT_ID --data mykey=myvalue,mykey2=myvalue2`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Deployments.description))
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

    const existingDeployments = await getDeployments(tenantId, installId)
    const existingDeployment = existingDeployments.data?.find((x) => x.id === args.deploymentId)
    if (!existingDeployment) {
      throw new Error('Deployment not found.')
    }

    existingDeployment.attributes.metadata = flags.overwrite
      ? attributes
      : {...existingDeployment?.attributes.metadata, ...attributes}

    const deployment = await updateDeployment(
      tenantId,
      installId,
      args.deploymentId!,
      existingDeployment.attributes.metadata,
      existingDeployment.attributes,
    )

    this.log(ux.colorize('cyan', `Updated Universal Broker Deployment for Tenant ${tenantId}, Install ${installId}`))
    this.log(printFormattedJSON(deployment))
    return JSON.stringify(deployment)
  }
}
