import {Args} from '@oclif/core'
import {Arg} from '@oclif/core/interfaces'
import {getConfig} from '../config/config.js'

interface CommonUniversalBrokerArgs {
  tenantId?: Arg<string, Record<string, unknown>>
  installId?: Arg<string, Record<string, unknown>>
}

const config = getConfig()
export const commonUniversalBrokerArgs = (): CommonUniversalBrokerArgs => {
  const argsObject: CommonUniversalBrokerArgs = {
    tenantId: Args.string({
      description: 'Tenant ID',
      required: true,
    }),
    installId: Args.string({
      description: 'Tenant ID',
      required: true,
    }),
  }
  if (process.env.TENANT_ID) {
    delete argsObject.tenantId
  }
  if (process.env.INSTALL_ID) {
    delete argsObject.installId
  }
  return argsObject
}

export const commonUniversalBrokerDeploymentId = (required = false) => {
  return {
    deploymentId: Args.string({description: 'Deployment ID', required, default: ''}),
  }
}
export const commonUniversalBrokerConnectionId = (required = false) => {
  return {
    connectionId: Args.string({description: 'Connection ID', required, default: ''}),
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

export const getCommonIds = (args: Record<string, string>) => {
  const tenantId = args.tenantId ?? process.env.TENANT_ID
  const installId = args.tenantId ?? process.env.INSTALL_ID

  return {tenantId, installId}
}
