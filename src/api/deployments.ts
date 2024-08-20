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
  metadata: DeploymentAttributesMetadata
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
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return response.body
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
  const response = await makeRequest(req)
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return response.body
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
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return response.statusCode
}

export const updateDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  deploymentAttributes: DeploymentAttributesMetadata,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}`
  const config = getConfig()
  const body = {
    data: {
      type: 'broker_deployment',
      attributes: {
        metadata: {
          ...deploymentAttributes,
        },
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
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return response.body
}
