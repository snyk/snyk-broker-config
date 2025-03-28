import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'

const logger = createLogger('snyk-broker-config')

export interface DeploymentAttributesMetadata {
  [key: string]: any
}
export interface DeploymentAttributes {
  broker_app_installed_in_org_id: string
  metadata: DeploymentAttributesMetadata
}
export interface UpdateDeploymentAttributes {
  broker_app_installed_in_org_id: string
  install_id: string
  metadata: DeploymentAttributesMetadata
}
export interface DeploymentResponseData {
  id: string
  type: string
  attributes: {
    broker_app_installed_in_org_id: string
    install_id: string
    metadata: Record<string, string>
  }
}
export interface DeploymentResponse {
  data: DeploymentResponseData
  jsonapi: {version: string}
  links: any
}

export interface DeploymentsResponse {
  data?: DeploymentResponseData[]
  jsonapi: {version: string}
  links: any
  errors?: any
}

export const getDeployments = async (tenantId: string, installId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  if (response.statusCode && response.statusCode === 404) {
    return {data: [], errors: [{details: '404'}]}
  }
  if (response.statusCode && response.statusCode > 299) {
    throw new Error(`${response.statusCode} - ${response.statusText ?? ''}`)
  }
  return JSON.parse(response.body) as DeploymentsResponse
}

export const createDeployment = async (
  tenantId: string,
  installId: string,
  deploymentAttributes: DeploymentAttributesMetadata,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments`
  const config = getConfig()
  const body = {
    data: {
      type: 'broker_deployment',
      attributes: {
        ...deploymentAttributes,
      },
    },
  }
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as DeploymentResponse
  } catch (error: any) {
    throw new Error(error)
  }
}

export const deleteDeployment = async (tenantId: string, installId: string, deploymentId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'DELETE',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return response.statusCode
}

export const updateDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  deploymentMetadata: DeploymentAttributesMetadata,
  deploymentAttributes?: Omit<UpdateDeploymentAttributes, 'metadata'>,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}`
  const config = getConfig()
  const body = {
    data: {
      type: 'broker_deployment',
      attributes: {
        metadata: {
          ...deploymentMetadata,
        },
        ...deploymentAttributes,
      },
    },
  }
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'PATCH',
    body: JSON.stringify(body),
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as DeploymentResponse
}
