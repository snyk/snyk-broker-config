import {Args} from '@oclif/core'
import {Arg} from '@oclif/core/interfaces'
import {getConfig} from '../config/config.js'

interface CommonUniversalBrokerArgs {
  tenantId: Arg<string, Record<string, unknown>>
  installId: Arg<string, Record<string, unknown>>
}

const config = getConfig()
export const commonUniversalBrokerArgs = (): CommonUniversalBrokerArgs => {
  const argsObject: CommonUniversalBrokerArgs = {
    tenantId: Args.string({
      description: 'Tenant ID',
      required: process.env.TENANT_ID ? false : true,
      default: process.env.TENANT_ID ?? '',
    }),
    installId: Args.string({
      description: 'Tenant ID',
      required: process.env.INSTALL_ID ? false : true,
      default: process.env.INSTALL_ID ?? '',
    }),
  }
  return argsObject
}
// export const commonUniversalBrokerArgs = {
//   tenantId:
//   installId: Args.string({description: 'Install ID', required: true}),
//   apiUrl: Args.string({description: 'API Url', required: false, default: 'https://api.snyk.io'}),
//   apiVersion: Args.string({description: 'API Version', required: false, default: '2024-07-18~experimental'}),
// }

export const commonUniversalBrokerDeploymentId = (required = false) => {
  return {
    deploymentId: Args.string({description: 'Deployment ID', required}),
  }
}
export const commonApiRelatedArgs = {
  apiUrl: Args.string({description: 'API Url', required: false, default: process.env.SNYK_API ?? config.API_HOSTNAME}),
  apiVersion: Args.string({
    description: 'API Version',
    required: false,
    default: process.env.SNYK_API_VERSION ?? config.API_VERSION,
  }),
}
