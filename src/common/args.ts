import {Args} from '@oclif/core'
import { Arg } from '@oclif/core/interfaces'
import { getConfig } from '../config/config.js'

interface CommonUniversalBrokerArgs {
    tenantId: Arg<string, Record<string, unknown>>,
    installId: Arg<string, Record<string, unknown>>,
    apiUrl: Arg<string, Record<string, unknown>>,
    apiVersion: Arg<string, Record<string, unknown>>
}

export const commonUniversalBrokerArgs = ():CommonUniversalBrokerArgs => {
    const config = getConfig()
    const argsObject: CommonUniversalBrokerArgs = {
        tenantId: Args.string({description: 'Tenant ID', required: process.env.TENANT_ID ? false: true, default: process.env.TENANT_ID ?? ''}),
        installId: Args.string({description: 'Tenant ID', required: process.env.INSTALL_ID ? false: true, default: process.env.INSTALL_ID ?? ''}),
        apiUrl: Args.string({description: 'API Url', required: false, default: process.env.SNYK_API ?? config.API_HOSTNAME}),
        apiVersion: Args.string({description: 'API Version', required: false, default: process.env.SNYK_API_VERSION ?? config.API_VERSION})

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
